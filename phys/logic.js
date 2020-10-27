const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var particles = [];
var forces = [];
const max_parts = 40;
const Îµ = 5;
ctx.font = '50px sans';


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function randInt(min, max)
{ 
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)); 
}

function randColor()
{
	var letters = '0123256789abcde';
	var color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[randInt(0,15)];
	}
return color; }

function angle(p1, p2) {
	//return Math.acos(x / Math.hypot(x, y)).toFixed(2); //* 180 / Math.PI; 
	return Math.atan2(p2.y - p1.y, p2.x - p1.x).toFixed(4);
}

function electric(p1, p2) {
	return ( Îµ * p1.c * p2.c) / ( Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2)); 
	
}

function draw() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	particles.forEach(function(part) {part.draw()});
}

function move() {
	for(let i = 0; i < particles.length; i++) {
		accx = 0;
		accy = 0;
		for(let j = 0; j < particles.length; j++) {
			if ( i != j ) {
			f = electric(particles[i],particles[j]).toFixed(2);
			fx = Math.cos(angle(particles[i],particles[j])).toFixed(2);
			fy = Math.sin(angle(particles[i],particles[j])).toFixed(2);
			//particles[i].x += f * fx;
			//particles[i].y += f * fy;
			accx += - f * fx;
			accy += - f * fy;
			}
			if ( particles[i].x < canvas.width / 10 ) 
			{ accx = 0; }
			 else if ( particles[i].x > canvas.width * 9 / 10) 
			{ accx = 0; }
			if ( particles[i].y < canvas.height / 10 ) { accy = 0;
			} else if ( particles[i].y > canvas.height * 9 / 10) { accy = 0; }

			particles[i].x += accx;
			particles[i].y += accy;
		}
	}
	draw();
}

function start() {
	
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	for(let i = 0; i < max_parts; i++) {
		particles.push(new Particle(i));
		forces[i] = [];
	}

	ctx.font = '30px sans';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	particles.forEach(function(part) {part.draw()});
	interval = setInterval(move, 20);
}

class Particle {
	constructor(i) {
		//this.x = randInt(canvas.width / 3,canvas.width * 2/3);
		//this.y = randInt(canvas.height / 3,canvas.height * 2/3);
		this.x = randInt(canvas.width * 0.45,canvas.width * 0.55);
		this.y = randInt(canvas.height * 0.45,canvas.height * 0.55);
		this.r = randInt(20,50);
		this.c = this.r //Math.sign(randInt(-1000,1000));
		this.n = i;
		this.t = Math.sign(this.c) * this.n;
		this.color = randColor();
	}

	draw() {
		ctx.beginPath();
		//ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fillText(this.t, this.x, this.y);
		//ctx.fill();
		ctx.stroke();
	}
}

