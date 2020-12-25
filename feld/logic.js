const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var bgColor = '#ddd';
var FONT = "Grundschrift";
var FONT_SIZE = 50;
var CARDS = [];

var time = 60;
var guiHeight;
var lines = 7;
var rows = 7;
var lineWidth;
var rowHeight;

var maxBoardSize = 600;
var alpha = 1;
var countdown = '';
var goal = 10;

var drawInterval;
var timeInterval;
var collisionInterval;

var colors = [ 
	'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
	'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
	'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
	'#9AD078', '#6DBFA9', '#F3B23C',
];

var restart_img = new Image();
restart_img.src = 'assets/restart.png';

const px = 'px ';
ctx.font = FONT_SIZE + px + FONT;
ctx.textBaseline = "hanging";

var cards = [];
var selection = [];
const par = new URLSearchParams(window.location.search);
	
if ( par.get('d')) 		{ lines = par.get('d'); rows = lines;}
if ( par.get('l')) 		{ lines = par.get('l');}
if ( par.get('r')) 		{ rows = par.get('d');}
if ( par.get('t')) 		{ time = par.get('t');}
if ( par.get('g')) 		{ time = par.get('g');}


function end() {
	cards = [];
	clearInterval(drawInterval);
	clearInterval(timeInterval);
	clearInterval(collisionInterval);
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	randCardsTimer = setInterval(randCards, 250);
	endDrawTimer = setInterval(endDraw, 30);
}

function randCards() {
	card = new Card(randInt(1,9), lineWidth, lineHeight);
	card.color = randPred();
	card.x = randInt(lineWidth / 2 ,canvas.width - lineWidth / 2);
	card.y = canvas.height + lineHeight;
	card.textColor = '#333';
	card.draw = function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w , this.h);
		ctx.fillStyle = this.textColor;
		ctx.fillText(this.group, this.x, this.y);
	}
	cards.push(card);
}

function initSelect(event) {
	select({ x: event.touches[0].clientX, y : event.touches[0].clientY });
}

function select(event) {
	for( i in cards ) {
		if(Match.card(event.x, event.y, cards[i])) {
			if ( cards[i].selected ) {
				cards[i].selected = false;
				cards[i].color = cards[i].textColor;
				cards[i].textColor = '#444';
				selection = [];
				return;
			}
			selection.push(i);
			cards[i].selected = true;
			cards[i].textColor = cards[i].color;
			cards[i].color = '#444';
			checkSelection()
		}
	}
}

function checkSelection() {
	let sum = 0;
	for (i in selection) {
		sum += cards[selection[i]].group;
	}
	if ( sum == goal ) {
		for( i in selection ) {
			delete cards[selection[i]]
		}
		if(new Set(cards).size == 1) {
			end();
		}
		selection = [];
	}
	else if ( selection.length == 2 ) {
		for(i in selection) {
			index = selection[i];
			cards[index].color = cards[index].textColor;
			cards[index].textColor = '#333';
			cards[selection[i]].selected = false;
		}
		selection = [];
	}
}

function endDraw() {
	ctx.font = FONT_SIZE + 'px ' + FONT;
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	rise();
	for(i in cards) { cards[i].draw(); }
}

function draw() {
	ctx.font = FONT_SIZE + 'px ' + FONT;
	ctx.globalAlpha = alpha;
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	fall();
	for(i in cards) {
		cards[i].draw(); 
	}
	ctx.fillStyle = '#333';
	ctx.globalAlpha = 1;
	ctx.font = guiHeight * 0.8 + 'px ' + FONT;
	ctx.fillText(time, canvas.width / 2, canvas.height / 12);
	ctx.font = '180px ' + FONT;
	ctx.fillText(countdown, canvas.width / 2, (canvas.height + guiHeight) / 2);
}

function timer() {
	time--;
	if(time == 0) {
		end();
	}
}

function checkCollision() {
	for(i in cards) {
		for(j in cards) {
			if ( j == i ) { continue; }
			if ( Match.card(cards[j].x, cards[j].y, cards[i])) {
				cards[j].y = -10;
			}
		}
	}
}

function rise() {
	for(i in cards) {
		cards[i].velocity.y -= Physics.g * 0.1 ;
		cards[i].y += cards[i].velocity.y;
	}
}

function fall() {
	for(i in cards) {
		let collision = false;
		cards[i].velocity.y += Physics.g;
		for(j in cards) {
			if(cards[i].y > canvas.height - cards[i].h) {
				collision = true;
				cards[i].velocity.y = 0;
				cards[i].y = canvas.height- cards[i].w / 2;
				break;
			}
			else if (cards[j].x == cards[i].x && cards[j].y > cards[i].y && cards[j].y - cards[i].y <= cards[i].h) {
				collision = true;
				cards[i].velocity.y = 0;
				cards[i].y = cards[j].y - cards[i].h;
				break;
			}
		}

		if( ! collision ) {
			cards[i].y += Math.min(cards[i].velocity.y, cards[i].h * 0.5);
		}
	}
}

function createCards() {
	lineWidth = Math.round(canvas.width / lines);
	lineHeight = Math.round((canvas.height - guiHeight) / rows);
	FONT_SIZE = lineHeight * 0.6;
	for(let i = 0; i < lines; i++ ) {
		for(let j = 0; j < rows; j++) {
			card = new Card(randInt(1,9), lineWidth, lineHeight);
			card.color = randPred();
			card.x = i * lineWidth + lineWidth / 2;
			card.y = randInt(-4000, -10);
			card.textColor = '#333';
			card.draw = function() {
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w , this.h);
				ctx.fillStyle = this.textColor;
				ctx.fillText(this.group, this.x, this.y);
			}
			cards.push(card);
		}
	}
	makeSolvable();
}

function makeSolvable() {
	index = randUnique(0,cards.length -1, cards.length);
	for(let i = 0; i < cards.length; i += 2) {
		cards[index[i+1]].group = goal - cards[index[i]].group;
	}
}

function init() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width,canvas.height);
	alpha = 0.4;
	ctx.font = FONT_SIZE + 'px ' + FONT;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	guiHeight = canvas.height / 6;
	createCards();
	sleep(1);
	drawInterval = setInterval(draw, 30);

	setTimeout( () => { countdown = 3 }, 2000);
	setTimeout( () => {countdown = 2 }, 3000);
	setTimeout( () => {countdown = 1 }, 4000);
	setTimeout( () => {
		countdown = 'LOS!';
		alpha = 1;
		timeInterval = setInterval(timer, 1000);
		canvas.addEventListener("touchstart", initSelect, false);
		canvas.addEventListener("mousedown", select, false);
	}, 5000);
	setTimeout( () => {countdown = '' }, 5500);
	setTimeout( () => setInterval(collisionInterval = checkCollision, 3000), 2000);
}
