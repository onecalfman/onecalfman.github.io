const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var bgColor = '#ddd';
var FONT = "Grundschrift";
var FONT_SIZE = 60;
var CARDS = [];
var IMG_SCALE = 0.8;
var SCALE = 0.8;
var charge = 5;
const CARD_SIZE = 265;
const BORDER = 5;
var CARDS_N = 10;
const epsilon = 5;
var words;
var circle;
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

var restart_img = new Image();
restart_img.src = 'assets/restart.png';

var buttons = [];
var rejectTimer = 0;
var acceptTimer = [];
var drawTimer;

const px = 'px ';
ctx.font = FONT_SIZE + px + FONT;
ctx.textBaseline = "hanging";

var cards = [];
var images = []

var time_counter = 0;


const par = new URLSearchParams(window.location.search);
	
if ( par.get('c')) 		{ charge = par.get('c');}
if ( par.get('s')) 		{ set = par.get('s');}
if ( par.get('n')) 		{ CARDS_N = par.get('n');}
set = 'm'

const label = [set.toUpperCase(), set.toLowerCase(), set.toUpperCase() + ' ' + set.toLowerCase()]

var mousedown = false;
var movestart = [0,0]
var finished = false;

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

function end() {
	canvas.removeEventListener("touchstart",  layer);
	canvas.removeEventListener("touchmove",  drag);
	canvas.removeEventListener("touchend",  match);
	canvas.addEventListener("touchstart", initTap);
	canvas.addEventListener("mousedown", tap);
	Physics.G = 1;
	CARDS.push(cards[0]);
	cards = CARDS;
	for(let i = 0; i < cards.length; i++) {
		clearInterval(acceptTimer[i]);
		center = new Blackhole();
		center.x = canvas.width / 2;
		center.y = canvas.height / 2;
		center.mass = 50000;
		cards[i].x = randInt(this.w / 2, canvas.width - this.w/2)
		cards[i].y = randInt(this.h / 2, canvas.height - this.h/2)
		cards[i].velocity = cards[i].satelliteVelocity(center);
		cards[i].boundary = false;
		cards[i].mass = 1;
	}
	cards.push(center);
	circle = setInterval(Physics.move, 40, cards);
	mover = setInterval(draw, 40);
}

function restart ()
{
	clearInterval(circle);
	clearInterval(mover);
	Physics.G *= -1;
	cards.pop();
	cards = [];
	CARDS = [];
	time_counter = 0;
	images = []
	rejectTimer = 0;
	acceptTimer = [];
	recolor();
	var mousedown = false;
	var movestart = [0,0]
	canvas.removeEventListener("mousedown", tap);
	canvas.removeEventListener("touchstart", initTap);
	draw();
	init();
}

function draw()
{
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	buttonCreate(3, 3, 1, canvas.width, canvas.height / 4);
	cards.forEach(function(card) {
		card.draw();
	});
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

function accept(card, time, duration, i , j) {
	draw();
	ctx.globalAlpha = sin[(Math.round(30 * (Date.now() - time)/duration))-1]
	ctx.fillStyle = '#339933';
	ctx.fillRect(buttons[i][0],buttons[i][1],buttons[i][2] - buttons[i][0], buttons[i][3] - buttons[i][1]);
	ctx.globalAlpha = 1;
	if ( Date.now() - time > duration ) { 
		clearInterval(acceptTimer[j]);
		draw();
	}
}

function reject(card, button, time, duration, i) {
	Physics.move([card,button]);
	draw();
	ctx.globalAlpha = sin[(Math.round(30 * (Date.now() - time)/duration))-1]
	ctx.fillStyle = '#993333';
	ctx.fillRect(buttons[i][0],buttons[i][1],buttons[i][2] - buttons[i][0], buttons[i][3] - buttons[i][1]);
	ctx.globalAlpha = 1;
	if ( Date.now() - time > duration ) {
		clearInterval(rejectTimer);
		cards.forEach(function(card) {
			card.velocity = { x : 0, y : 0 };
		})
		draw();
	}
}

function initTap(event) {
	tap({ x: event.touches[0].clientX, y : event.touches[0].clientY });
}

function tap(event) {
	x = event.x;
	y = event.y;
	for(let i = cards.length - 1; i >= 0; i--) {
		if(Match.point(x,y,cards[i].x, cards[i].y, cards[i].w, cards[i].h)) {
			if ( cards[i] instanceof Endcard) { 
				restart(); 
				return;
			}
			if ( cards[i].snd[0] ) { 
				cards[i].play(); 
				return;
			}
		}
	}
}

function match()
{
	clearInterval(drawTimer);
	canvas.removeEventListener("mousemove",  drag);
	canvas.removeEventListener("touchmove",  initDrag);
	card = cards[cards.length - 1];
	for ( let i = 0; i < buttons.length; i++) {
		lx = buttons[i][0] <= card.x;
		rx = buttons[i][2] >= card.x;
		ly = buttons[i][1] <= card.y;
		ry = buttons[i][3] >= card.y;

		if (lx && rx && ly && ry) { 
			if ( card.group.includes(label[i]) ) {
				j = acceptTimer.length;
				acceptTimer.push(setInterval(accept, 50, card, Date.now(), 600, i, j));
				cards.pop();
				if ( ! cards.length ) { 
					cards.push(new Endcard()); 
					cards[0].x = canvas.width / 2;
					cards[0].y = canvas.height / 2;
					end();
				}
			}
			else if ( i == 2 && (! card.group.includes(label[0])) && (! card.group.includes(label[1]))) {
				j = acceptTimer.length;
				acceptTimer.push(setInterval(accept, 5, card, Date.now(), 600, i, j));
				cards.pop();
				if ( ! cards.length ) { 
					cards.push(new Endcard); 
					cards[0].x = canvas.width / 2;
					cards[0].y = canvas.height / 2;
					draw();
					end();
				}
			}
			else {
				clearInterval(rejectTimer);
				button = new Card('button', 5, 5, 2);
				button.x = buttons[i][0] + buttons[i][2] / 2;
				button.y = canvas.height * 1.6;
				button.mass = 600000;
				rejectTimer = setInterval(reject, 50, card, button, Date.now(), 600, i);
			}
			draw();
			return;
		}
	}
	if ( card.x == movestart[0] && card.y == movestart[1] ) {
		if ( card instanceof Endcard) { 
			restart(); 
			return;
		}
		if ( card.snd[0] ) { card.play(); }
	}
	draw();
}

function initLayer(event) {
	event = { x: event.touches[0].clientX, y : event.touches[0].clientY } 
	layer(event);
}

function layer(event)
{ 
	let x = event.x;
	let y = event.y;
	bgColor = '#c54';
	drawTimer = setInterval(draw, 20);
	for ( let i = cards.length - 1; i >= 0; i-- )
	{
		if (Match.card(x,y,cards[i]) ) { 
			cards.push(cards[i]);
			movestart = [cards[i].x,cards[i].y]
			cards.splice(i, 1);
			canvas.addEventListener("touchmove",  initDrag);
			canvas.addEventListener("mousemove",  drag);
			return;
		}
	}
}

function initDrag(event) {
	drag({ x: event.touches[0].clientX, y : event.touches[0].clientY });
}
function drag(event)
{ 
	let x = event.x;
	let y = event.y;
	if (true)
	{
		card = cards[cards.length - 1]
		card.x = x;
		card.y = y;
		if ( card.x - card.w / 2 < 0 ) { card.x = card.w / 2; }
		if ( canvas.width - card.w / 2 < card.x ) { card.x = canvas.width - card.w / 2 ; }
		if ( card.y - card.h / 2 < 0 ) { card.y = card.h / 2; }
		if ( canvas.height - card.h / 2 < card.y ) { card.y = canvas.height - card.h / 2; }
	}
}

class Endcard extends Card {
	constructor() {
		super('uniqe', CARD_SIZE * 0.7, CARD_SIZE * 0.7);
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.color = randPred();
		this.img = restart_img;
	}

	draw() { 
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y , this.w/2, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.3
		ctx.drawImage(restart_img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		ctx.globalAlpha = 1;
	}
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

function createCard(txt, img, snd) {
	let size = Math.min(canvas.width / 4, canvas.height / 4, 200);
	card = new Card(txt, size, size, 100); 
	card.x = randInt(canvas.width * 0.4, canvas.width * 0.6);
	card.y = randInt(canvas.height * 0.4, canvas.height * 0.6);
	card.img[0] = img;
	card.snd[0] = new Audio(snd);
	card.mass = Math.sqrt(this.w * this.h);
	card.boundary = { x : canvas.width * 0.05, y : canvas.height * 0.05, w : canvas.width * 0.95, h : buttons[0][1] * 0.9 }
	return card;
}


function init()
{
	var lines = [];
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.font = FONT_SIZE * SCALE + px + FONT;
	ctx.textBaseline = "hanging";
	ctx.globalAlpha = 1;
	if ( isTouchDevice() ) { Physics.G = -6 } else { Physics.G = -2 }

	set = 'm';
	words = getWords(set);
	for(let i = 0; i < words.length; i++) {
		word = assets[words[i]]
		lines.push(word)
	}

	for(let i = 0; i < CARDS_N; i++)
	{
		n = randInt(0,lines.length - 1);
		let cells = lines[n];
		images[i] = new Image();
		images[i].onload = function() { 
			cards.push(createCard(cells[0], images[i], cells[2]));
			CARDS.push(createCard(cells[0], images[i], cells[2]));
		}
		images[i].src = cells[1];
		lines.splice(n,1);
	}

	bgColor = '#534';

	var timer = setInterval(Physics.move, 30, cards);
	var drawer = setInterval(draw, 10);

	setTimeout(function() { 
		clearInterval(timer);
		clearInterval(drawer);
		bgColor = '#53c';
		cards.forEach(function(card) {
			card.boundary.h = canvas.height; 
			card.velocity = { x : 0, y : 0 };
		});
		draw();
	}, 2000)

	canvas.addEventListener("touchstart", initLayer);
	canvas.addEventListener("touchend", match);
	canvas.addEventListener("mousedown", layer);
	canvas.addEventListener("mouseup", match);

	window.addEventListener("resize", resize);
}

