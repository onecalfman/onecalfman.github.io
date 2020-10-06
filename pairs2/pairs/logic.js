const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//const PAIRS = 'pairs.csv';
const PAIRS = 'anlaute.csv';
const FONT_SIZE = 80;
const IMG_SCALE = 0.1;
const BORDER = 5;
const CARDS_N = 10;
const sound = new Image();
sound.scr = "assets/sound.png";

ctx.font = FONT_SIZE + 'px sans';
ctx.textBaseline = "hanging";

var cards = [];

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


function uniteImgImg(c1, c2, n)
{
	unite = new United(c1.group, c1.x, c1.y, (c1.w + c2.w) / 2, (c1.h + c2.h) / 2);
	unite.img.push(c1.img);
	unite.img.push(c2.img);
	cards.pop();
	cards.splice(n,1);
	cards.push(unite);
}
function uniteSndSnd(c1, c2, n)
{
	console.log('snd snd');
	console.log(c1);
	console.log(c2);
}
function uniteTxtTxt(c1, c2, n)
{
	console.log('txt txt');
	console.log(c1);
	console.log(c2);
}
function uniteTxtImg(c1, c2, n)
{
	console.log('txt img');
	console.log(c1);
	console.log(c2);
}
function uniteSndImg(c1, c2, n)
{
	console.log('snd img');
	console.log(c1);
	console.log(c2);
}
function uniteSndTxt(c1, c2, n)
{
	console.log('snd txt');
	console.log(c1);
	console.log(c2);
}

function unite(n)
	{
	i = cards.length - 1
	imgA = cards[i] instanceof ImageCard;
	imgP = cards[n] instanceof ImageCard;
	sndA = cards[i] instanceof SoundCard;
	sndP = cards[n] instanceof SoundCard;
	textA = cards[i] instanceof TextCard;
	textP = cards[n] instanceof TextCard;                         // active passive
	if      ( imgA && imgP ) { uniteImgImg(cards[n],cards[i],n);}   // img	img
	else if ( sndA && sndP ) { uniteSndSnd(cards[n],cards[i],n);}   // snd	snd
	else if ( textA && textP ) { uniteTxtTxt(cards[n],cards[i],n);} // text	text
	else if ( textA && imgP ) { uniteTxtImg(cards[i],cards[n],n);}  // text	img
	else if ( imgA && textP ) { uniteTxtImg(cards[n],cards[i],n);}  // img	text
	else if ( imgA && sndP ) { uniteSndImg(cards[n],cards[i],n);}   // img	snd
	else if ( sndA && imgP ) { uniteSndImg(cards[i],cards[n],n);}   // snd	img
	else if ( sndA && textP ) { uniteSndTxt(cards[i],cards[n],n);}  // snd	text
	else if ( textA && textP ) { uniteSndTxt(cards[n],cards[i],n);} // text	snd

	//card = new United(img.group, img.x, img.y, img.w, img.h + text.h);
	//card.text = text.text;
	//card.img = img.img;

	//ctx.font = FONT_SIZE * 0.7 + 'px sans';
	//text_width = ctx.measureText(card.text).width * 1.05;
	//if ( card.w < text_width ) { card.w = text_width; }
	//cards.splice(n,1);
	//cards.pop();
	//cards.push(card);

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

class SoundCard {
	constructor(group, text) {
	this.group = group;
	this.text = text;
	ctx.font = FONT_SIZE + 'px sans';
	this.h = FONT_SIZE * 1.1;
	this.w = Math.ceil(ctx.measureText(text).width);
	this.x = randInt(0, canvas.width - this.w);
	this.y = randInt(0, canvas.height - this.h);
	this.snd = randPred();
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
	this.img = [];
	}

	draw() {
		if( this.img.length > 1 ) 
		{ 
			for( let i = 0; i < this.img.length - 1; i++ ) {
			ctx.drawImage(this.img[i], this.x, this.y, this.w, this.h) 
			}
		}
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
	
	for(let i = 0; i <= CARDS_N; i++)
	{
		n = randInt(0,lines.length - 1);
		cells = lines[n].split(',');
		lines.splice(n,1);
		for( let j = 0; j < cells.length; j++)
		{
			if ( cells[j].endsWith('png') || cells[j].endsWith('PNG'))
			{
			cards.push(new ImageCard(i,cells[j]));
			} 
			else if  ( cells[j].endsWith('mp3') || cells[j].endsWith('wav'))
			{
			cards.push(new SoundCard(i,cells[j]));
			} 
			else 
			{
			cards.push(new TextCard(i,cells[j]));
			}
		}
	}

	for( let i = 0; i < cards.length; i++) {
		ctx.fillStyle  = cards[i].color;
		cards[i].draw();
	}

	canvas.onmousedown = function(event) { layer(event.clientX,event.clientY); };
	canvas.onmouseup = function(event) { mousedown = false; match(); };
	canvas.addEventListener("touchstart", function(event) { layer(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
	canvas.addEventListener("touchmove",  function(event) { drag(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
    	canvas.addEventListener("touchend",  function(event) {mousedown = false; match();});

	window.addEventListener("resize", function(event) {resize();}, true);
	//window.addEventListener("deviceorientation", rotate(event), true);
}
