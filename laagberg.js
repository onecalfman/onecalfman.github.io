speaker = new Image();

var colors = [ 
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
Match.point = function(pointX, pointY, boxX, boxY, boxW, boxH)
{
	if ( boxX - boxW / 2 < pointX && pointX < boxX + boxW / 2 && boxY - boxH / 2 < pointY && pointY < boxY + boxH / 2 ) {
		return true;
	}
	else {
		return false
	}
}

Match.overlap = function(p1, p2)
{
	lx = p1.x - p1.w / 2 < p2.x + p2.w / 2; // right overlap
	rx = p2.x - p2.w / 2 < p1.x + p1.w / 2; // left overlap
	ay = p1.y - p1.h / 2 < p2.y + p2.h / 2; // above overlap
	by = p2.y - p2.h / 2 < p1.y + p1.h / 2; // below overlap
	if ( lx && rx && ay && by ) { return true; }
	else { return false; }
}

function PlaceImg() {
}

PlaceImg.center = function() {
	img = arguments[0];
	switch(arguments.length) {
		case 1:
			ctx.drawImage(img,canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
			break;
		case 2:
			max = PlaceImg.max(img, arguments[1]);
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


Math.sigmoid = function(x) {
	return 1/(1+Math.pow(Math.E,-x));
}

Math.sigmoid_derivative = function(x) {
	return Math.sigmoid(x) * ( 1 - Math.sigmoid(x));
}

Math.distance = function(p1,p2)
{
	return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2));
}

Math.angle = function (p1, p2) {
	return Math.atan2(p2.y - p1.y,p2.x - p1.x);
}

Math.distanceVector = function(p1,p2)
{
	return {x: p2.x - p1.x, y: p2.y - p1.y}
}

Math.norm = function(p1,p2) {
	length = Math.distance(p1,p2)
	return {
		x: (p2.x - p1.x)/length,
		y: (p2.y - p1.y)/length
	}
}


function Physics() {
}

Physics.epsilon = 1;
Physics.G = 1;
Physics.c = 10;


Physics.coulomb = function(p1, p2)
{
	magnitude = (Physics.epsilon * p1.charge * p2.charge) / (Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2)); 
	angle = Math.angle(p1,p2);
	return {x: - Math.cos(angle) * magnitude, y: - Math.sin(angle) * magnitude }; 
}

Physics.gravity = function(p1,p2)
{
	magnitude = (Physics.G * p1.mass * p2.mass) / (Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2))
	angle = Math.angle(p1,p2);
	return {x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude }; 
}

Physics.newton = function(p)
{
	return p.mass * p.a;
}

Physics.move = function(particles)
{
	for(let i = 0; i < particles.length; i++) {
		for(let j = i+1; j < particles.length; j++) {
			let force = Physics.gravity(particles[i],particles[j]);
			particles[i].velocity.x += force.x / particles[i].mass;
			particles[i].velocity.y += force.y / particles[i].mass;
			particles[j].velocity.x -= force.x / particles[j].mass;
			particles[j].velocity.y -= force.y / particles[j].mass;
		}
	particles[i].x += particles[i].velocity.x;
	particles[i].y += particles[i].velocity.y;
	particles[i].draw();
	}
}


class Particle {
	constructor() {
		this.w = randInt(5,100);
		this.h = this.w;
		this.x = randInt(this.w / 2, canvas.width - this.w / 2);
		this.y = randInt(this.h / 2, canvas.height - this.h / 2);
		//this.charge = Physics.epsilon * Math.log(this.w * this.h);
		//this.mass = Physics.G * this.w;
		this.charge = 0;
		this.mass = Math.sqrt(this.w * this.h);
		this.friction = 0;
		//this.velocity = {x: randInt(-1000,1000)/5000, y: randInt(-1000,1000)/5000};
		this.velocity = {x: 0, y: 0};
		this.acceleration = {x: 0, y : 0};
		this.force = {x: 0, y: 0};
		this.boundary;
	}

	satelliteVelocity(body) {
		let v = Math.sqrt(Math.abs(Physics.G) * body.mass/Math.distance(this,body));
		let alpha = Math.angle(this,body);
		return {x: - v * Math.sin(alpha), y: v * Math.cos(alpha)};
	}

	forces(particles) {
		let force = {x:0,y:0};
		let coulomb = {x:0,y:0};
		let gravity = {x:0,y:0};
		for( let i = 0; i < particles.length; i++) {
			if ( particles[i] !== this && Math.abs(particles[i].x - this.x) > 1 && Math.abs(particles[i].y - this.y) > 1) {
				coulomb = Physics.coulomb(this, particles[i])
				gravity = Physics.gravity(this, particles[i])
				force.x += coulomb.x + gravity.x;
				force.y += coulomb.y + gravity.y;
			} 
		}
		this.force.x = force.x + this.acceleration.x;
		this.force.y = force.y + this.acceleration.y;
		this.velocity.x += (1 - this.friction) * this.force.x/this.mass;
		this.velocity.y += (1 - this.friction) * this.force.y/this.mass;
	}
	move() {
		let x = Math.sign(this.velocity.x) * Math.min(Math.abs(this.velocity.x), Physics.c);
		let y = Math.sign(this.velocity.y) * Math.min(Math.abs(this.velocity.y), Physics.c);
		if ( this.boundary ) {
			if ( this.x + x < this.boundary.x || this.boundary.x + this.boundary.w < this.x + x ) {
				x = 0;
			}
			if ( this.y + y < this.boundary.y || this.boundary.y + this.boundary.h < this.y + y ) {
				y = 0;
			}
		}
		this.x += x;
		this.y += y;
	}
	draw() {
		ctx.font = '30px Arial';
		ctx.fillStyle = this.color;
		 //ctx.fillRect(this.x, this.y, this.w, this.h)
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.w/2, 0, Math.PI * 2, true);
		ctx.fill();
	}
	debug() {
		ctx.font = "20px Arial"
		ctx.fillStyle = '#000000';
		//ctx.fillText(this.group, this.x + this.w/2, this.y + this.h/2)
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.velocity.x * 100, this.y + this.velocity.y * 100);
		ctx.stroke();
		ctx.fillText((this.force.x* 1000).toFixed(3) + ' ' + (this.force.y* 1000).toFixed(3), this.x, this.y);
	}
}

class Blackhole extends Particle {
	constructor() {
		super();
		this.mass = this.mass * 100;
	}

	draw() {}
}

class Card extends Particle {
	constructor(group, w, h) {
		super();
		this.group = group;
		this.w = w;
		this.h = h;
		this.img = [];
		this.txt = [];
		this.snd = [];
		this.color;
	}

	add(card)
	{

		for ( let i = 0; i < card.img.length; i++ ) {
			this.img.push(card.img[i]);
			if ( this.w < CARD_SIZE * SCALE ) {
				this.w = CARD_SIZE * SCALE;
			}
			this.h = CARD_SIZE * SCALE;
		}
		if ( ! this.txt[0] ) { this.txt = card.txt; }
		else {
			for ( let i = 0; i < card.txt.length; i++ ) {
				if ( card.txt[0][0] == card.txt[0][0].toUpperCase()) {
					this.txt[0] = card.txt[i] + " " + this.txt[0];
				} else {
					this.txt[0] = this.txt[0] + " " + card.txt[0];
				}
				if ( this.w < ctx.measureText(this.txt[0]).width * 1.4) { 
					this.w = ctx.measureText(this.txt[0]).width * 1.4
				}
				this.txt.push(card.txt[i]);
				this.txt.pop();
			}
		}
		
		if ( this.img[0] ) {
			if ( this.w < CARD_SIZE * SCALE ) { this.w = CARD_SIZE * SCALE; }
			if (this.h < CARD_SIZE * SCALE ) { this.h = CARD_SIZE* SCALE; }
		}

		if ( ! this.color ) { this.color = '#bbbbbb'; };
		
		cards.splice(n,1);
	}

	draw()
	{
		if ( this.color ) {
			ctx.globalAlpha = 0.6;
			if ( this.snd[0] ) { ctx.globalAlpha = 1; }
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
			ctx.globalAlpha = 1;
		}

		var imgl = this.img.length;
		for ( let i = 0; i < imgl; i++) {
			PlaceImg.center(this.img[i], this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		}

		if (this.snd[0] ) {
			ctx.globalAlpha = 0.3;
			//ctx.drawImage(speaker, this.x, this.y, this.w, this.h);
			if ( this.txt[0] || this.img[0] ) {
				ctx.drawImage(speaker, this.x - this.w / 2 + this.w * 0.7, this.y - this.h / 2 , this.w * 0.3, this.h * 0.3);
			} else {
				ctx.drawImage(speaker, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
			}
			ctx.globalAlpha = 1;
		}
		var txtl = this.txt.length;
		for ( let i = 0; i < txtl; i++) {
			ctx.globalAlpha = 0.6;
			ctx.fillStyle = '#bbbbbb';
			ctx.fillRect(this.x, this.y + this.h - FONT_SIZE, this.w, FONT_SIZE);
			ctx.globalAlpha = 1;
			ctx.fillStyle = '#000000';
			ctx.textBaseline = "bottom";
			ctx.font = FONT_SIZE + px + FONT;
			ctx.textAlign = 'center';
			ctx.fillText(this.txt[i], this.x + this.w / 2 , this.y + this.h + FONT_SIZE * 0.1);
		}

	}

	play() { this.snd[0].play(); }
}
