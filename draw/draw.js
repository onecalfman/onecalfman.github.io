const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight;

var FONT = "Roboto Slab";
var FONT_SIZE = 100;

var offset = document.getElementById('sidebar').clientWidth;
ctx.canvas.width = window.innerWidth - offset * 0.6;

ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
var bgColor = '#ddd';
var fgColor = '#333';

var shapes = [];
var nodes = [];
var labels = [];

var selector = 'c';
var shape = false;


function Draw() {
}

Draw.circle = function(x,y,r) {
	ctx.beginPath();
	ctx.lineWidth = 8;
	ctx.arc(x, y, r, 0, Math.PI * 2, true);
	ctx.stroke();
}

Draw.rect = function(x,y,w,h) {
	ctx.lineWidth = 8;
	ctx.strokeRect(x,y,w,h);
}

function draw() {
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = fgColor;
	ctx.font = FONT_SIZE + 'px ' + FONT;
	for(i in shapes) {
		shapes[i].draw();
	}
}

class Circle {
	constructor(x,y,w,h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw() {
		ctx.beginPath();
		ctx.lineWidth = 8;
		ctx.arc(this.x, this.y, Math.hypotenuse(this.w,this.h), 0, Math.PI * 2, true);
		ctx.stroke();
	}
};

class Rectangle {
	constructor(x,y,w,h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw() {
		ctx.lineWidth = 8;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
};

class Line {
	constructor(x,y,w,h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw() {
		ctx.beginPath();
		ctx.lineWidth = 8;
		ctx.beginPath();
    		ctx.moveTo(this.x, this.y);
    		ctx.lineTo(this.x + this.w, this.y + this.h);
		ctx.stroke();
	}
};

function create(event) {
	if(event.buttons && ! shape) {
		switch(selector) {
			case 'c' :
				shape = new Circle(event.layerX, event.y, 10, 10);
				break;
			case 'r' :
				shape = new Rectangle(event.layerX, event.y, event.layerX + 10, event.y + 10);
				break;
			case 'l' :
				shape = new Line(event.layerX, event.y, event.layerX + 10, event.y + 10);
				break;
			case 't' :
				shape = new Text(event.layerX, event.y);
				break;
		}
		shapes.push(shape);
	}
	else if(event.buttons) {
		shape.w = - shape.x + event.layerX;
		shape.h = - shape.y + event.y;
	}
}

function endCreate() {
	shape = false;
}

function sidebarIcons() {
	const canvasRect = document.getElementById('rect');
	const canvasCircle = document.getElementById('circle');
	const canvasTriangle = document.getElementById('triangle');
	const canvasLine = document.getElementById('line');
	
	const ctxRect = canvasRect.getContext('2d');
	const ctxCircle = canvasCircle.getContext('2d');
	const ctxTriangle = canvasTriangle.getContext('2d');
	const ctxLine = canvasLine.getContext('2d');

	ctxRect.lineWidth = 4;
	let w = canvasRect.width;
	ctxRect.strokeRect(w * 0.1, w * 0.1, w * 0.8, w * 0.8);

	ctxCircle.beginPath();
	w = canvasCircle.width;
	ctxCircle.lineWidth = 4;
	ctxRect.strokeRect(w * 0.1, w * 0.1, w * 0.8, w * 0.8);
	ctxCircle.arc(w / 2, w / 2, w * 0.45, 0, Math.PI * 2, true);
	ctxCircle.stroke();

	w = canvasTriangle.width;
	ctxTriangle.beginPath();
	ctxTriangle.lineWidth = 4;
	ctxTriangle.beginPath();
	ctxTriangle.moveTo(w*0.9, w*0.1);
	ctxTriangle.lineTo(w*0.9, w*0.9);
	ctxTriangle.lineTo(w*0.2, w / 2);
	ctxTriangle.closePath();
	ctxTriangle.stroke();

	ctxLine.beginPath();
	w = canvasLine.width;
	ctxLine.lineWidth = 4;
	ctxLine.beginPath();
    	ctxLine.moveTo(w * 0.1, w * 0.9);
    	ctxLine.lineTo(w * 0.9, w * 0.1);
	ctxLine.stroke();

}

function init() {
	draw();
	sidebarIcons();

	canvas.addEventListener("touchstart", create, false);
	canvas.addEventListener("touchend", create, false);

	canvas.addEventListener("mousemove", create, false);
	canvas.addEventListener("mouseup", endCreate, false);
	drawTimer = setInterval(draw, 30);
}
