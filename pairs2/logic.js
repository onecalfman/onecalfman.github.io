const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//const PAIRS = 'pairs.csv';
const PAIRS = 'anlaute.csv';
const FONT_SIZE = 80;
const IMG_SCALE = 1;
const BORDER = 5;
const CARDS_N = 10;
const sound = new Image();
sound.scr = "assets/sound.png";

sounds = []
sounds.push(new Audio('/anlaute/snd/bruh.mp3'));
sounds.push(new Audio('/anlaute/snd/minecraft_alpha_damage.mp3'))
sounds.push(new Audio('/anlaute/snd/roblox.mp3'))
sounds.push(new Audio('/anlaute/snd/Minecraft_villager.mp3'))


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


//function uniteImgImg(c1, c2, n)
//{
//	unite = new United(c1.group, c1.x, c1.y, (c1.w + c2.w) / 2, (c1.h + c2.h) / 2);
//	unite.img.push(c1.img);
//	unite.img.push(c2.img);
//	cards.pop();
//	cards.splice(n,1);
//	cards.push(unite);
//}
//function uniteSndSnd(c1, c2, n)
//{
//	console.log('snd snd');
//	console.log(c1);
//	console.log(c2);
//}
//function uniteTxtTxt(c1, c2, n)
//{
//	console.log('txt txt');
//	console.log(c1);
//	console.log(c2);
//}
//function uniteTxtImg(c1, c2, n)
//{
//	console.log('txt img');
//	console.log(c1);
//	console.log(c2);
//}
//function uniteSndImg(c1, c2, n)
//{
//	console.log('snd img');
//	console.log(c1);
//	console.log(c2);
//}
//function uniteSndTxt(c1, c2, n)
//{
//	console.log('snd txt');
//	console.log(c1);
//	console.log(c2);
//}

function unite(p)
{
	a = cards.length - 1;
	if ( cards[a] instanceof United ) { 
		cards[a].add(p);
		console.log('a'); 

	}
	else if ( cards[p] instanceof United ) {
		cards[p].add(a); console.log('p');
	}
	else {
		console.log('new united');
		if ( cards[a].w < cards[p].w) { w = cards[p].w; } else { w = cards[a].w; }
		if ( cards[a].h < cards[p].h) { h = cards[p].h; } else { h = cards[a].h; }
		u = new United(cards[a].group, cards[a].x, cards[a].y, w, h);
		u.add(a);
		u.add(p);
		cards.push(u);
	}
	draw();

	//imgA = cards[i] instanceof ImageCard;
	//imgP = cards[n] instanceof ImageCard;
	//sndA = cards[i] instanceof SoundCard;
	//sndP = cards[n] instanceof SoundCard;
	//txt = cards[i] instanceof TextCard;
	//txt = cards[n] instanceof TextCard;                         // active passive
	//if      ( imgA && imgP ) { uniteImgImg(cards[n],cards[i],n);}   // img	img
	//else if ( sndA && sndP ) { uniteSndSnd(cards[n],cards[i],n);}   // snd	snd
	//else if ( txt && txt ) { uniteTxtTxt(cards[n],cards[i],n);} // txt	txt
	//else if ( txt && imgP ) { uniteTxtImg(cards[i],cards[n],n);}  // txt	img
	//else if ( imgA && txt ) { uniteTxtImg(cards[n],cards[i],n);}  // img	txt
	//else if ( imgA && sndP ) { uniteSndImg(cards[n],cards[i],n);}   // img	snd
	//else if ( sndA && imgP ) { uniteSndImg(cards[i],cards[n],n);}   // snd	img
	//else if ( sndA && txt ) { uniteSndTxt(cards[i],cards[n],n);}  // snd	txt
	//else if ( txt && txt ) { uniteSndTxt(cards[n],cards[i],n);} // txt	snd

	//card = new United(img.group, img.x, img.y, img.w, img.h + txt.h);
	//card.txt = txt.txt;
	//card.img = img.img;

	//ctx.font = FONT_SIZE * 0.7 + 'px sans';
	//txt_width = ctx.measureText(card.txt).width * 1.05;
	//if ( card.w < txt_width ) { card.w = txt_width; }
	//cards.splice(n,1);
	//cards.pop();
	//cards.push(card);

	draw();
}


function match()
{
	card = cards[cards.length - 1];
	if ( card instanceof SoundCard ) { card.play(); };
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
	this.snd = snd;
	this.color = randPred();
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.drawImage(sound, this.x, this.y, sound.width, sound.height);
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
	this.color = randColor();
	//this.img_pos = [];
	this.img = [];
	this.snd = [];
	this.txt = [];
	}

	add(n)
	{
		if ( cards[n].img ) {
			this.img.push(cards[n].img);
		}
		if ( cards[n].snd ) {
			this.snd.push(cards[n].snd);
		}
		if (cards[n].txt) {
			this.txt.push(cards[n].txt);
			this.h += FONT_SIZE * 1.2;
		}
		
		cards.splice(n,1);
	}

	draw()
	{
		//console.log('drawn');
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		var imgl = this.img.length;
		for ( let i = 0; i < imgl; i++) {
			var offsetX = i * this.w / 2;
			var offsetY = i * (this.h - FONT_SIZE * 1.2) / 2;
			ctx.drawImage(this.img[i], this.x + offsetX , this.y + offsetY, 1.3 * this.img[i].width / imgl, 1.3 * this.img[i].height / imgl );
		}
		var txtl = this.txt.length;
		for ( let i = 0; i < txtl; i++) {
			ctx.fillStyle = '#000000';
			ctx.textBaseline = "bottom";
			ctx.font = FONT_SIZE + 'px sans';
			ctx.textAlign = 'center';
			ctx.fillText(this.txt[i], this.x + this.w / 2 , this.y + this.h + FONT_SIZE * 0.1);
		}
	}
}




function init()
{
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	lines = open(PAIRS).split('\n')
	
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
