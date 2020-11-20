const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const PAIRS = 'anlaute.csv';
var FONT = "Grundschrift";
var FONT_SIZE = 60;
var IMG_SCALE = 0.8;
var SCALE = 0.8;
var charge = 5;
const CARD_SIZE = 265;
const BORDER = 5;
const CARDS_N = 10;
const epsilon = 5;
const buttonsX = canvas.width;
const buttonsY = canvas.height  / 4;
var colors = [ 
	'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
	'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
	'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
	'#9AD078', '#6DBFA9', '#F3B23C',
];

const sin = [0,0.106795,0.212370,0.315515,0.415052,0.50984,0.59879,0.68090,0.75522,0.82090,0.87720,0.92345,0.95915,0.98388,0.9973,0.99941,0.99004,0.96935,0.93757,0.8950,0.84233,0.77995,0.7086,0.62925,0.54265,0.449845,0.35189,0.249915,0.14507,0]
const alphabet = "abcdefghijklmnopqrstuvwxyz"
var set = alphabet[randInt(0,alphabet.length - 1)];
const buttonColors = [randPred(), randPred(), randPred()]

const speaker_img = new Image();
speaker_img.scr = 'assets/speaker.png';

var speaker = new Image();
speaker.src = 'assets/speaker.png';
var restart_img = new Image();
restart_img.src = 'assets/restart.png';

var buttons = [];
var rejectTimer = 0;
var acceptTimer = [];

const px = 'px ';
ctx.font = FONT_SIZE + px + FONT;
ctx.textBaseline = "hanging";

var cards = [];
var csv = []

var time_counter = 0;


const par = new URLSearchParams(window.location.search);
	
if ( par.get('c')) 		{ charge = par.get('c');}
if ( par.get('s')) 		{ set = par.get('s');}

const label = [set.toUpperCase(), set.toLowerCase(), set.toUpperCase() + ' ' + set.toLowerCase()]

var mousedown = false;
var movestart = [0,0]
var finished = false;
for (let i = 0; i <= CARDS_N; i++) { csv.push([]); }

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
	n = randInt(0,colors.length -1);
	color = colors[n];
	colors.splice(n,1);
	return color;
}

function endcard ()
{
	ctx.fillStyle = randPred();
	ctx.fillStyle = '#000000';
	ctx.fillRect(canvas.width / 2 - CARD_SIZE, canvas.height / 2 - CARD_SIZE, CARD_SIZE * 2, CARD_SIZE * 2);
}

function recolor() {
	colors = [ 
		'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
		'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
		'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
		'#9AD078', '#6DBFA9', '#F3B23C',
	];
}

function restart ()
{
	cards = [];
	time_counter = 0;
	csv = []
	recolor();
	var mousedown = false;
	var movestart = [0,0]
	for (let i = 0; i <= CARDS_N; i++) { csv.push([]); }
	draw();
	init();
}

function draw()
{
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = '#ddd';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	buttonCreate(3, 3, 1, canvas.width, canvas.height / 4);
	cards.forEach(function(card) {card.draw()});
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

function angle(p1, p2) {
	return Math.atan2((p2.y + p2.h) - (p1.y + p1.h), (p2.x + p2.w) - (p1.x + p1.w)).toFixed(4);
}

function electric(p1, p2) {
	return ( epsilon * p1.charge * p2.charge) / (Math.pow((p1.x + p1.w / 2) - (p2.x + p2.w / 2),2) + Math.pow((p1.y + p1.h / 2) - (p2.y + p2.h / 2),2)); 
}

function accept(card, time, duration, i , j) {
	draw();
	ctx.globalAlpha = sin[(Math.round(30 * (Date.now() - time)/duration))-1]
	ctx.fillStyle = '#339933';
	ctx.fillRect(buttons[i][0],buttons[i][1],buttons[i][2] - buttons[i][0], buttons[i][3] - buttons[i][1]);
	ctx.globalAlpha = 1;
	if ( Date.now() - time > duration ) { clearInterval(acceptTimer[j]); draw(); }
}

function reject(card, button, time, duration, i) {
	var accx = 0;
	var accx = 0;
	f = electric(card,button).toFixed(2);
	accx += - f * Math.cos(angle(card,button)).toFixed(2);
	accy += - f * Math.sin(angle(card,button)).toFixed(2) * 2; 

	if ( Math.abs(accx) > 10 ) accx = 10 * Math.sign(accx);
	if ( Math.abs(accy) > 10 ) accy = 10 * Math.sign(accy);

	if ( card.x < canvas.width * 0.04 || card.x + card.w > canvas.width * 0.96) { accx = 0; } 
	if ( card.y < canvas.height * 0.04) { accy = 0; }
	
	card.x += accx;
	card.y += accy;
	move();
	draw();
	ctx.globalAlpha = sin[(Math.round(30 * (Date.now() - time)/duration))-1]
	ctx.fillStyle = '#993333';
	ctx.fillRect(buttons[i][0],buttons[i][1],buttons[i][2] - buttons[i][0], buttons[i][3] - buttons[i][1]);
	ctx.globalAlpha = 1;
	if ( Date.now() - time > duration ) { clearInterval(rejectTimer); draw(); }
}

function move(time, duration) {
	for(let i = 0; i < cards.length; i++) {
		accx = 0;
		accy = 0;
		for(let j = 0; j < cards.length; j++) {
			if ( i != j ) {
			f = electric(cards[i],cards[j]).toFixed(2);
			fx = Math.cos(angle(cards[i],cards[j])).toFixed(2);
			fy = Math.sin(angle(cards[i],cards[j])).toFixed(2);
			accx += - f * fx;
			accy += - f * fy;
			if ( Math.abs(accx) > 10 ) accx = 10 * Math.sign(accx);
			if ( Math.abs(accy) > 10 ) accy = 10 * Math.sign(accy);

			if ( cards[i].x < canvas.width * 0.04 || cards[i].x + cards[i].w > canvas.width * 0.96) { accx = 0; } 
			if ( cards[i].y < canvas.height * 0.04 || cards[i].y + cards[i].h > (canvas.height - buttonsY) * 0.8) { accy = 0; }
	
			cards[i].x += accx;
			cards[i].y += accy;
			}
		}
	}
	time_counter++;
	if ( Date.now() - time > duration ) { clearInterval(timer); }
	draw();
}

function match()
{
	card = cards[cards.length - 1];
	for ( let i = 0; i < buttons.length; i++) {
		lx = buttons[i][0] <= card.x + card.w/2;
		rx = buttons[i][2] >= card.x + card.w / 2;
		ly = buttons[i][1] <= card.y + card.h/2;
		ry = buttons[i][3] >= card.y + card.h / 2;

		if (lx && rx && ly && ry) { 
			if ( card.txt[0].includes(label[i]) ) {
				j = acceptTimer.length;
				acceptTimer.push(setInterval(accept, 5, card, Date.now(), 600, i, j));
				cards.pop();
				if ( ! cards.length ) { cards.push(new Endcard); }
			}
			else if ( i == 2 && (! card.txt[0].includes(label[0])) && (! card.txt[0].includes(label[1]))) {
				j = acceptTimer.length;
				acceptTimer.push(setInterval(accept, 5, card, Date.now(), 600, i, j));
				cards.pop();
				if ( ! cards.length ) { cards.push(new Endcard); }
			}
			else {
				clearInterval(rejectTimer);
				button = new Card('button', 5, 5, 2);
				button.x = buttons[i][0] + buttons[i][2] / 2;
				button.y = canvas.height * 1.6;
				button.charge = 6000;
				rejectTimer = setInterval(reject, 5, card, button, Date.now(), 600, i);
			}
			draw();
			return;
		}
	}
	if ( card.x === movestart[0] && card.y === movestart[1] ) {
		if ( card instanceof Endcard) { 
			restart(); 
			return;
		}
		if ( card.snd[0] ) { card.play(); }
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


class Endcard {
	constructor() {
		this.group = 'uniqe';
		this.w = CARD_SIZE * 1.5;
		this.h = CARD_SIZE * 1.5;
		this.x = canvas.width / 2 - this.w / 2;
		this.y = canvas.height / 2 - this.h / 2;
		//this.x = canvas.width - this.w; 
		//this.y = canvas.height - this.h;
		this.color = randPred();
		this.img = restart_img;
	}

	draw() { 
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 0.3
		ctx.drawImage(restart_img, this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 1;
	}
}

class Card {
	constructor(group,w,h,c) {
	this.group = group;
	this.w = w;
	this.h = h;
	//this.x = randInt(0, canvas.width - this.w);
	//this.y = randInt(0, canvas.height - this.h);
	this.x = randInt(canvas.width * 0.4 - this.w/2 , canvas.width * 0.6 - this.w);
	this.y = randInt(canvas.height * 0.4 - this.h/2 , canvas.height * 0.6 - this.h);
	this.img = [];
	this.snd = [];
	this.txt = [];
	this.color;
	this.charge = charge * Math.log(this.w * this.h);
	}

	add(n)
	{

		for ( let i = 0; i < cards[n].img.length; i++ ) {
			this.img.push(cards[n].img[i]);
			if ( this.w < CARD_SIZE * SCALE ) {
				this.w = CARD_SIZE * SCALE;
			}
			this.h = CARD_SIZE * SCALE;
		}
		for ( let i = 0; i < cards[n].snd.length; i++ ) {
			this.snd.push(cards[n].snd[i]);
			this.color = cards[n].color;
		}
		if ( ! this.txt[0] ) { this.txt = cards[n].txt; }
		else {
			for ( let i = 0; i < cards[n].txt.length; i++ ) {
				if ( cards[n].txt[0][0] === cards[n].txt[0][0].toUpperCase()) {
					this.txt[0] = cards[n].txt[i] + " " + this.txt[0];
				} else {
					this.txt[0] = this.txt[0] + " " + cards[n].txt[0];
				}
				if ( this.w < ctx.measureText(this.txt[0]).width * 1.4) { 
					this.w = ctx.measureText(this.txt[0]).width * 1.4
				}
				this.txt.push(cards[n].txt[i]);
				this.txt.pop();
			}
		}
		
		if ( this.img[0] ) {
			if ( this.w < CARD_SIZE * SCALE ) { this.w = CARD_SIZE * SCALE; }
			if (this.h < CARD_SIZE * SCALE ) { this.h = CARD_SIZE* SCALE; }
		}

		if ( ! this.color ) { this.color = '#bbbbbb'; };
		
		cards.splice(n,1);

		if ( cards.length === CARDS_N ) 
		{ 
			cards.push(new Endcard());
		}
	}

	draw()
	{
		if ( this.color ) {
			ctx.globalAlpha = 0.6;
			if ( this.snd[0] ) { ctx.globalAlpha = 1; }
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.globalAlpha = 1;
		}

		var imgl = this.img.length;
		for ( let i = 0; i < imgl; i++) {
			if ( imgl === 1 ) { 
				var offsetX = this.w / 2 - this.img[0].width * IMG_SCALE / 2;
				var offsetY = this.h / 2 - this.img[0].height * IMG_SCALE / 2;
			} else {
				var offsetX = i * this.w / 2 + 0.07 * this.w;
				var offsetY = i * (this.h - FONT_SIZE * 1.2) / 2 + 0.07 * this.w;
			}
			ctx.drawImage(this.img[i], this.x + offsetX, this.y + offsetY, (this.img[i].width / imgl) * IMG_SCALE , (this.img[i].height / imgl) * IMG_SCALE );
		}

	}

	play() { this.snd[0].play(); }
}

function buttonEval(event) {
	x = event.clientX;
	y = event.clientY;
	for(let i = 0; i < buttons.length; i++) {
		if (buttons[i][0] < x && x < buttons[i][2] && buttons[i][1] < y && y < buttons[i][3]) {
			canvas.removeEventListener('click', buttonEval);
			check(i+1);
			return i + 1;
		}
	}
}

function buttonCreate(n,x_dim,y_dim,width,height) {

	w = Math.ceil(width/x_dim);
	h = Math.ceil(height/y_dim);

	offsetX = (window.innerWidth - width) / 2;
	height = window.innerHeight - height;
	offsetY = height;

	fontsize = Math.min.apply( Math, [h,w] ) * 0.5;
	ctx.font = fontsize + 'px ' + FONT;
	ctx.fillStyle = '#333333';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	for(let i = 0; i < y_dim; i++) {
		if (n && i == y_dim - 1 && n < x_dim * y_dim) {
			n_last_row = n - x_dim * (y_dim - 1);
			w = Math.round(width/n_last_row);
		}
		for(let j = 0; j < x_dim; j++) {

			x = Math.ceil(j * w) + offsetX;
			y = Math.ceil(i * h) + offsetY;
			ctx.fillStyle = buttonColors[i+j];
			ctx.fillRect(x - 1,y - 1,w + 2,h + 2);

			ctx.fillStyle = '#333333';
			buttons[i+j] = ([x,y,x + w,y + h]);
			ctx.fillText(label[i+j], x + w / 2,y + h/2);
			if ( i+j == 2) {
				lineHeight = fontsize * 0.1;
				t = ctx.measureText(label[i+j]);
				ctx.fillRect(x + w/2 - t.width/ 2, y + h/2 - lineHeight, t.width, lineHeight);
			}
		}
	}
}



function init()
{
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	lines = open(PAIRS).split('\n')
	
	ctx.font = FONT_SIZE * SCALE + px + FONT;
	ctx.textBaseline = "hanging";

	//buttonCreate(3, 3, 1, canvas.width / 2 , canvas.height / 2);

	for(let i = 0; i < CARDS_N; i++)
	{
		n = randInt(0,lines.length - 1);
		cells = lines[n].split(',');
		for(let j = 0; j < cells.length; j++) {
			cells[j].trim();
		}
		csv[i][0] = cells[0];
		csv[i][2] = cells[2];
		csv[i][1] = new Image();
		csv[i][1].onload = function() { 
			cards.unshift(new Card(i, csv[i][1].width, csv[i][1].height, 100)); 
			cards[0].img[0] = csv[i][1];
			//csv[i][2] = new Audio(cells[2]);
			cards[0].snd[0] = new Audio(csv[i][2]);
			cards[0].txt[0] = csv[i][0];
			draw();
		}
		csv[i][1].src = cells[1];
		lines.splice(n,1);

	}


	timer = setInterval(move, 5, Date.now(), 1000);

	canvas.onmousedown = function(event) { layer(event.clientX,event.clientY); };
	canvas.onmouseup = function(event) { mousedown = false; match(); };
	canvas.addEventListener("touchstart", function(event) { layer(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
	canvas.addEventListener("touchmove",  function(event) { drag(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
    	canvas.addEventListener("touchend",  function(event) {mousedown = false; match();});

	window.addEventListener("resize", function(event) {resize();}, true);
	draw();
}

