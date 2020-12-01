colors = [ 
	'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
	'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
	'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
	'#9AD078', '#6DBFA9', '#F3B23C',
];

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function randInt(min, max)	{
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
	}
	
function randColor()
{
	var letters = '0123456789abcde';
	var color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[randInt(0,15)];
	}
return color;
}

function randPred()
{
	return colors[randInt(0,colors.length -1)];
}

function uniq(arr) {
counts = [];
for (let i = 0; i < arr.length; i++) {
    counts[arr[i][0]] = 1 + (counts[arr[i][0]] || 0);
}
return counts.length - 1;
}

function log(message) 
{
      console.log(message)
}

function Match() {
}
Match.point = function(eventPointX, eventPointY, matchPointX, matchPointY, matchPointW, matchPointH)
{
	if (matchPointX < eventPointX && matchPointX < matchPointX + matchPointW && matchPointY < eventPointY && eventPointY < matchPointY + matchPointH) {
		return true;
	}
}

Match.overlap = function(card1, card2)
{
	lx = card1.x < card2.x && card2.x < card1.x + card1.w;
	rx = card2.x < card1.x && card1.x < card2.x + card2.w;
	ly = card1.y < card2.y && card2.y < card1.y + card1.w;
	ry = card2.y < card1.y && card1.y < card2.y + card2.h;
	if ((lx && (ly || ry )) || (rx && (ly || ry ))) { 
		return true;
	}
}

function PlaceImg() {
}

PlaceImg.center = function() {
	img = arguments[0];
	log(arguments);
	switch(arguments.length) {
		case 1:
			log(1);
			ctx.drawImage(img,canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
			break;
		case 2:
			max = PlaceImg.max(img, arguments[1]);
			log(2);
			ctx.drawImage(img,canvas.width / 2 - max[0] / 2, canvas.height / 2 - max[1] / 2, max[0], max[1]);
			break;
		case 3: 
			x = arguments[1];
			y = arguments[2];
			size = PlaceImg.maxXY(img, x, y);
			ctx.drawImage(img,canvas.width / 2 - size[0] / 2, canvas.height / 2 - size[1] / 2, size[0], size[1]);
			break;
		case 5:
			x = arguments[1];
			y = arguments[2];
			w = arguments[3];
			h = arguments[4];
			size = PlaceImg.maxXY(img, w, h);
			ctx.drawImage(img, x + w/2 - size[0] / 2, y + h/2 - size[1] / 2, size[0], size[1]);
			break;
	}
} 

PlaceImg.max = function(img,maxmax) {
	if ( img.width < img.height ) {
		maxy = maxmax;
		maxx = maxy * img.width / img.height;
	} else {
		maxx = maxmax;
		maxy = maxx * img.height / img.width;
	}
	return [Math.round(maxx),Math.round(maxy)]
}

PlaceImg.maxX = function(img,maxXx)
{
	maxXy = maxXx * img.height / img.width;
	return [Math.round(maxXx),Math.round(maxXy)]
}
PlaceImg.maxY = function(img,maxYy)
{
	maxYx = maxYy * img.width / img.height;
	return [Math.round(maxYx),Math.round(maxYy)]
}

PlaceImg.maxXY = function(img, maxXYx, maxXYy)
{
	if ( img.width/maxXYx > img.height/maxXYy) {
		return PlaceImg.maxX(img,maxXYx);
	}
	else {
		return PlaceImg.maxY(img,maxXYy);
	}
}

function PlaceText(){
}

PlaceText.center = function(){
	txt = arguments[0];
	log(arguments);
	ctx.font = '100px Roboto';
	ctx.textAlign = 'center';
	ctx.textBaseline = "middle";
	ctx.fillStyle = '#ffffff';
	switch(arguments.length) {
		case 1:
			ctx.fillText(txt,canvas.width / 2 - ctx.measureText(txt).width / 2, canvas.height / 2 - PlaceText(txt) / 2);
			break;
		case 2:
			max = PlaceImg.max(img, arguments[1]);
			log(2);
			ctx.fillText(img,canvas.width / 2 - max[0] / 2, canvas.height / 2 - max[1] / 2, max[0], max[1]);
			break;
	}
}

PlaceText.height = function(text) {
	measure = ctx.measureText(text);
	return measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
}

PlaceText.fontheight = function(text) {
	measure = ctx.measureText(text);
	return measure.fontBoundingBoxAscent + measure.fontBoundingBoxDescent;
}

function Physics() {
}

Physics.epsilon = 0;
Physics.G = 0.1;
Physics.c = 10;

Physics.sigmoid = function(x) {
	return 1/(1+Math.pow(Math.E,-x));
}

Physics.sigmoid_derivative = function(x) {
	return Physics.sigmoid(x) * ( 1- Physics.sigmoid(x));
}

Physics.coulomb = function(p1, p2)
{
	magnitude = (Physics.epsilon * p1.charge * p2.charge) / (Math.pow((p1.x + p1.w / 2) - (p2.x + p2.w / 2),2) + Math.pow((p1.y + p1.h / 2) - (p2.y + p2.h / 2),2)); 
	angle = Physics.angle(p1,p2);
	return {x: - Math.cos(angle) * magnitude, y: - Math.sin(angle) * magnitude }; 
}

Physics.gravity = function(p1,p2)
{
	magnitude = (Physics.G * p1.mass * p2.mass) / (Math.pow((p1.x + p1.w / 2) - (p2.x + p2.w / 2),2) + Math.pow((p1.y + p1.h / 2) - (p2.y + p2.h / 2),2))
	angle = Physics.angle(p1,p2);
	return {x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude }; 
}

Physics.newton = function(p)
{
	return p.mass * p.a;
}

Physics.distance = function(p1,p2)
{
	return Math.sqrt(Math.pow((p1.x + p1.w / 2) - (p2.x + p2.w / 2),2) + Math.pow((p1.y + p1.h / 2) - (p2.y + p2.h / 2),2));
}

Physics.angle = function (p1, p2) {
	return Math.atan2((p2.y + p2.h) - (p1.y + p1.h), (p2.x + p2.w) - (p1.x + p1.w)).toFixed(4);
}

class Particle {
	constructor() {
		this.w = randInt(10,200);
		this.h = this.w;
		this.x = randInt(0, canvas.width - this.w);
		this.y = randInt(0, canvas.height - this.h);
		this.charge = Physics.epsilon * Math.log(this.w * this.h);
		this.mass = Physics.G * this.w;
		this.friction = 0;
		this.velocity = {x: randInt(-1000,1000)/5000, y: randInt(-1000,1000)/5000};
		this.acceleration = {x: 0, y : 0}
		this.color = randPred();
		this.force = {x:0, y:0};
	}

	forces(particles) {
		for( let i = 0; i < particles.length; i++) {
			if ( particles[i] !== this && Math.abs(particles[i].x - this.x) > 1 && Math.abs(particles[i].y - this.y) > 1) {
				var coulomb = 0;
				var gravity = 0;
				coulomb = Physics.coulomb(this, particles[i])
				gravity = Physics.gravity(this, particles[i])
			} else { coulomb = {x:0, y:0}; gravity = {x:0, y:0};}
		}
		this.force.x = coulomb.x + gravity.x + this.acceleration.x;
		this.force.y = coulomb.y + gravity.y + this.acceleration.y;
		this.velocity.x += this.force.x/this.mass;
		this.velocity.y += this.force.y/this.mass;
	}
	move() {
		this.x += Math.sign(this.velocity.x) * Math.min(Math.abs(this.velocity.x), Physics.c);
		this.y += Math.sign(this.velocity.y) * Math.min(Math.abs(this.velocity.y), Physics.c);
	}
	draw() {
		ctx.font = '30px Arial';
		ctx.fillStyle = this.color;
		//ctx.fillRect(this.x, this.y, this.w, this.h)
		ctx.beginPath();
		ctx.arc(this.x + this.w/2, this.y +this.h/2, this.w/2, 0, Math.PI * 2, true);
		ctx.fill();
	}
	debug() {
		ctx.fillStyle = '#000000';
		//ctx.fillText(this.group, this.x + this.w/2, this.y + this.h/2)
		ctx.beginPath();
		ctx.moveTo(this.x + this.w/2, this.y + this.h/2);
		ctx.lineTo( this.x + this.w/2 + this.velocity.x * 100, this.y  +this.h / 2 + this.velocity.y * 100);
		ctx.stroke();
		ctx.fillText((this.force.x* 1000).toFixed(3) + ' ' + (this.force.y* 1000).toFixed(3), this.x + this.w/2, this.y  +this.h / 2);
	}
}

class Satellite extends Particle {
	constructor(body) {
		super();
		this.x = randInt(canvas.width / 7, canvas.width * 6/7 - this.w);
		this.y = randInt(canvas.height / 7, canvas.height * 6/7 - this.w);
		this.velocity = this.initialVelocity(body);
		log(this.velocity);
	}

	initialVelocity(body) {
		let v = Math.sqrt(Physics.G * body.mass/Physics.distance(this,body));
		let alpha = Physics.angle(this,body);
		console.log(alpha);
		return {x: - v * Math.sin(alpha), y: v * Math.cos(alpha)};
	}
	draw() {
		ctx.font = '30px Arial';
		ctx.fillStyle = this.color;
		//ctx.fillRect(this.x, this.y, this.w, this.h)
		ctx.beginPath();
		ctx.arc(this.x + this.w/2, this.y +this.h/2, this.w/2, 0, Math.PI * 2, true);
		ctx.fill();
	}
	debug() {
		ctx.fillStyle = '#000000';
		//ctx.fillText(this.group, this.x + this.w/2, this.y + this.h/2)
		ctx.beginPath();
		ctx.moveTo(this.x + this.w/2, this.y + this.h/2);
		ctx.lineTo( this.x + this.w/2 + this.velocity.x * 100, this.y  +this.h / 2 + this.velocity.y * 100);
		ctx.stroke();
		ctx.fillText((this.force.x* 1000).toFixed(3) + ' ' + (this.force.y* 1000).toFixed(3), this.x + this.w/2, this.y  +this.h / 2);
	}
}
