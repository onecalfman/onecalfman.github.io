const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//const PAIRS = 'pairs.csv';
const PAIRS = 'anlaute.csv';
const FONT_SIZE = 80;
const IMG_SCALE = 1;
const BORDER = 5;
const CARDS_N = 5;

const speaker_img = new Image();
speaker_img.scr = '/anlaute/assets/speaker.png';

var speaker = new Image();
speaker.src = 'assets/speaker.png';

ctx.font = FONT_SIZE + 'px sans';
ctx.textBaseline = "hanging";

var cards = [];
var images = []

colors = [
	'#86C9B7',
	'#87A7C7',
	'#94D0A1',
	'#8ECC85',
	'#AAAAAA',
	'#F69856',
	'#F4A96D',
	'#90A8CC',
	'#93AACF',
	'#B67BB4',
	'#ABA9CE',
	'#F086A2',
	'#F1785B',
	'#9AD078',
	'#6DBFA9',
	'#F3B23C',
];

var mousedown = false;
var movestart = [0,0]

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


function draw()
{
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = '#ddd';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	cards.forEach(function(card) {card.draw()});
	//for( let i = 0; i < cards.length; i++) {
		//cards[i].draw();
	//}
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


function unite(p)
{
	a = cards.length - 1;
	if ( cards[a] instanceof United ) { 
		cards[a].add(p);

	}
	else if ( cards[p] instanceof United ) {
		cards[p].add(a);
	}
	else {
		console.log('new united');
		if ( cards[a].w <= cards[p].w) { w = cards[p].w; } else { w = cards[a].w; }
		if ( cards[a].h <= cards[p].h) { h = cards[p].h; } else { h = cards[a].h; }
		u = new United(cards[a].group, cards[a].x, cards[a].y, w, h);
		u.add(a);
		u.add(p);
		cards.push(u);
	}
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
	console.log(movestart[0]);
	console.log(card.x);
	console.log(movestart[1]);
	console.log(card.y);
	if ( card.x === movestart[0] && card.y === movestart[1] ) {
		if ( card instanceof SoundCard ) { card.play(); };
		if ( card instanceof United && card.snd ) { card.play(); };
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
				movestart = [cards[i].x,cards[i].y]
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
	this.img = img;
	this.h = images[group].height * IMG_SCALE;
	this.w = images[group].width * IMG_SCALE;
	this.x = randInt(0, canvas.width - this.w);
	this.y = randInt(0, canvas.height - this.h);
	}

	draw() { ctx.drawImage(this.img, this.x, this.y, this.w, this.h); }
}

class TextCard {
	constructor(group, txt) {
	this.group = group;
	this.txt = txt;
	ctx.font = FONT_SIZE + 'px sans';
	this.h = FONT_SIZE * 1.1;
	this.w = Math.ceil(ctx.measureText(txt).width);
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
		ctx.fillText(this.txt,this.x + this.w/2,this.y + this.h * 0.1);
	}
}

class SoundCard {
	constructor(group, snd) {
	this.group = group;
	this.h = 100;
	this.w = 100;
	this.x = randInt(0, canvas.width - this.w);
	this.y = randInt(0, canvas.height - this.h);
	this.snd = new Audio(snd);
	this.color = randPred();
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 0.2;
		ctx.drawImage(speaker, this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 1;
	}

	play() { this.snd.play(); }
}

class United {
	constructor(group,x,y,w,h) {
	this.group = group;
	this.h = h;
	this.w = w;
	this.x = x;
	this.y = y;
	this.color = randPred();
	this.img = [];
	this.snd = [];
	this.txt = [];
	}

	add(n)
	{
		if ( cards[n].img ) {
			this.img.push(cards[n].img);
			this.w = 265;
			this.h = 265;
		}
		if ( cards[n].snd ) {
			this.snd.push(cards[n].snd);
			this.color = cards[n].color;
		}
		if (cards[n].txt) {
			this.txt.push(cards[n].txt);
		}
		
		cards.splice(n,1);
	}

	draw()
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		var imgl = this.img.length;
		for ( let i = 0; i < imgl; i++) {
			if ( imgl === 1 ) { 
				var offsetX = this.w / 2 - this.img[0].width / 2;
				console.log('offsetX');
				console.log('offsetY');
				var offsetY = this.h / 2 - this.img[0].height / 2;
			} else {
				var offsetX = i * this.w / 2 + 15;
				var offsetY = i * (this.h - FONT_SIZE * 1.2) / 2;
			}
			ctx.drawImage(this.img[i], this.x + offsetX , this.y + offsetY, this.img[i].width / imgl, this.img[i].height / imgl );
		}

		if (this.snd[0] ) {
			ctx.globalAlpha = 0.3;
			//ctx.drawImage(speaker, this.x, this.y, this.w, this.h);
			ctx.drawImage(speaker, this.x + 180, this.y, 80, 80);
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
			ctx.font = FONT_SIZE + 'px sans';
			ctx.textAlign = 'center';
			ctx.fillText(this.txt[i], this.x + this.w / 2 , this.y + this.h + FONT_SIZE * 0.1);
		}

	}

	play() { this.snd[0].play(); }
}




function init()
{
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	lines = open(PAIRS).split('\n')
	
	for(let i = 0; i <= CARDS_N; i++)
	{
		n = randInt(0,lines.length - 1);
		c = randInt(0,colors.length - 1);
		cells = lines[n].split(',');
		lines.splice(n,1);
		colors.splice(c,1);
		for( let j = 0; j < cells.length; j++)
		{
			if ( cells[j].endsWith('png') || cells[j].endsWith('PNG')) {
			images[i] = new Image();
			images[i].onload = function() { cards.push(new ImageCard(i,images[i])); draw();}
			images[i].src = cells[j];
			} 
			else if  ( cells[j].endsWith('mp3') || cells[j].endsWith('wav') || cells[j].endsWith('m4a'))
			{
			cards.push(new SoundCard(i,cells[j]));
			} 
			else 
			{
			cards.push(new TextCard(i,cells[j]));
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
	draw();
}
