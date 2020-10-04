const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const PAIRS = 'pairs.csv';
const FONT_SIZE = 40;
const IMG_SCALE = 0.5;
const BORDER = 8;
const sound = new Image();
sound.scr = "assets/sound.png";

ctx.font = FONT_SIZE + 'px sans';
ctx.textBaseline = "hanging";

var cards = [];
var CARDS_N = 20;

colors = [
	'#788ca3',
	'#9f8785',
	'#482848',
	'#224a7a',
	'#50951c',
	'#233b6c'
];

var mousedown = false;

function open(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
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


function draw()
{
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = '#ddd';
	for( let i = 0; i < cards.length; i++) {
		ctx.fillStyle  = cards[i].color;
		cards[i].draw();
	}
}


function resize()
{
	old_w = canvas.width;
	old_h = canvas.height;

	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	for ( let i = 0; i < cards.length; i++ )
	{
		cards[i].x = canvas.width * cards[i].x / old_w;
		cards[i].y = canvas.height * cards[i].y / old_h;
	}
	draw();
}

function unite(n)
{
	if ( cards[n].img ) { 
		img = cards[n];
		txt = cards[cards.length - 1];
	} else {
		img = cards[cards.length - 1];
		txt = cards[n];
	}
	card = new United(img.group, img.x, img.y, img.w, img.h + txt.h);
	card.text = txt.text;
	card.img = img.img;

	ctx.font = FONT_SIZE * 0.7 + 'px sans';
	text_width = ctx.measureText(card.text).width * 1.05;
	if ( card.w < text_width ) { card.w = text_width; }
	cards.splice(n,1);
	cards.pop();
	cards.push(card);

	draw();
}


function match()
{
	card = cards[cards.length - 1];
	for ( let i = cards.length - 1; 0 <= i; i--) {
		group = card.group === cards[i].group;
		lx = card.x < cards[i].x && cards[i].x < card.x + card.w;
		rx = cards[i].x < card.x && card.x < cards[i].x + cards[i].w;
		ly = card.y < cards[i].y && cards[i].y < card.y + card.w;
		ry = cards[i].y < card.y && card.y < cards[i].y + cards[i].h;
		if ( group && ((lx && (ly || ry )) || (rx && (ly || ry )))) { 
			unite(i);
			return;
			cards.pop();
			cards.splice(i, 1);
			draw();
			if ( ! cards.length ) { init(); }
			return;
		}
	}
}

function layer(x,y)
{ 
	mousedown = true;
	for ( let i = cards.length - 1; i >= 0; i-- )
	{
		if ( cards[i].x <= x && x <= cards[i].x + cards[i].w ) {
			if ( cards[i].y <= y && y <= cards[i].y + cards[i].h ) 
			{ 
				cards.push(cards[i]);
				cards.splice(i, 1);
				canvas.onmousemove = function(event) { drag(event.clientX, event.clientY); };
				return;
			
			}
		}
	}
	mousedown = false;
}

function drag(x,y)
{ 
	if (mousedown)
	{
		card = cards[cards.length - 1]
		card.x = x - card.w / 2;
		card.y = y - card.h / 2;
		if ( card.x < 0 ) { card.x = 0; }
		if ( canvas.width - card.w < card.x ) { card.x = canvas.width - card.w; }
		if ( card.y < 0 ) { card.y = 0; }
		if ( canvas.height - card.h < card.y ) { card.y = canvas.height - card.h; }
		draw();
	}
}


class Card {
	constructor(group, h, w) {
		this.group = group;
		this.h = h; 
		this.w = w;
		this.x = randInt(0, canvas.width - this.w);
		this.y = randInt(0, canvas.height - this.h);
		//this.color = randColor();
		this.color = randPred();
	}

	draw()
	{
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

class ImageCard {
	constructor(group, img) {
	this.group = group;
	var im = new Image();
	im.src = img;
	this.img = im;
	this.h = this.img.height * IMG_SCALE;
	this.w = this.img.width * IMG_SCALE;
	this.x = randInt(0, canvas.width - this.w);
	this.y = randInt(0, canvas.height - this.h);
	}

	draw() { ctx.drawImage(this.img, this.x, this.y, this.w, this.h); }
}

class TextCard {
	constructor(group, text) {
	this.group = group;
	this.text = text;
	ctx.font = FONT_SIZE + 'px sans';
	this.h = FONT_SIZE * 1.1;
	this.w = Math.ceil(ctx.measureText(text).width);
	this.x = randInt(0, canvas.width - this.w);
	this.y = randInt(0, canvas.height - this.h);
	this.color = randPred();
	}

	draw() {
		//ctx.fillStyle = this.color;
		//ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.fillStyle = '#000000';
		ctx.textBaseline = "hanging";
		ctx.font = FONT_SIZE + 'px sans';
		ctx.textAlign = 'center';
		ctx.fillText(this.text,this.x + this.w/2,this.y + this.h * 0.1);
	}
}

class United {
	constructor(group,x,y,w,h) {
	this.group = group;
	this.h = h;
	this.w = w;
	this.x = x;
	this.y = y;
	this.text;
	this.text_h = FONT_SIZE;
	this.color = '#666666';
	this.sound;
	this.img;
	}

	draw() {
		if( ! this.text ) { ctx.drawImage(this.img, this.x, this.y, this.w, this.h); }
		else {
			ctx.fillStyle = '#bbbbbb';
			ctx.fillRect(this.x,this.y,this.w,this.h);
			ctx.fillStyle = '#ffffff';
			//ctx.fillRect(this.x + BORDER,this.y + BORDER, this.w - BORDER * 2,this.h - BORDER * 2);
			ctx.drawImage(this.img, this.x + (this.w - this.img.width * IMG_SCALE) / 2, this.y, this.img.width * IMG_SCALE, this.img.height * IMG_SCALE);
			ctx.fillStyle = '#444444';
			ctx.font = FONT_SIZE * 0.7 + 'px sans';
			ctx.textAlign = 'center';
			ctx.fontBaseline = 'bottom';
			ctx.fillText(this.text,this.x + this.w/2,this.y + this.h - FONT_SIZE);
		}
		if ( this.sound ) { 
			ctx.drawImage(sound, this.x + this.w - sound.width, this.y);
		}
	}
}

function init()
{
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	lines = open(PAIRS).split('\n')

	//for( let i = 0; i < CARDS_N; i++ ) 
	//{ 
		//cards[i] = new Card("test", 100, 100);
		//cards[i].layer = i;
	//}
	
	for(let i = 0; i < lines.length -1; i++)
	{
		cells = lines[i].split(',');
		for( let j = 0; j < cells.length; j++)
		{
			if ( cells[j].endsWith('png'))
			{
			cards.push(new ImageCard(i,cells[1]));
			} else {
			cards.push(new TextCard(i,cells[0]));
			}
		}
	}

	draw();

	canvas.onmousedown = function(event) { layer(event.clientX,event.clientY); };
	canvas.onmouseup = function(event) { mousedown = false; match(); };
	canvas.addEventListener("touchstart", function(event) { layer(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
	canvas.addEventListener("touchmove",  function(event) { drag(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
    	canvas.addEventListener("touchend",  function(event) {mousedown = false; match();});

	window.addEventListener("resize", function(event) {resize();}, true);
	//window.addEventListener("deviceorientation", rotate(event), true);
}
