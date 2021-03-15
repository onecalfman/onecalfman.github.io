const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var bgColor = '#ddd';
var FONT = "Grundschrift";
var FONT_SIZE = 50;

var time = 60;
const TIME = time;
var guiHeight = canvas.height / 6;
var columns = 4;
var rows = 6;
var lineWidth;
var rowHeight;

var alpha = 1;
var countdown = '';
var goal = 10;

var drawInterval;
var timeInterval;
var collisionInterval;
var randCardsInterval;
var endDrawInterval;

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
var endCards = [];
var selection = [];
const par = new URLSearchParams(window.location.search);
	
if ( par.get('d')) 		{ columns = par.get('d'); rows = columns;}
if ( par.get('c')) 		{ columns = par.get('c');}
if ( par.get('r')) 		{ rows = par.get('d');}
if ( par.get('t')) 		{ time = par.get('t');}
if ( par.get('g')) 		{ goal = par.get('g');}


function end(n) {
	cards = [];
	endCards = [];
	clearInterval(drawInterval);
	clearInterval(timeInterval);
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);

	canvas.removeEventListener("touchend", select, false);
	canvas.removeEventListener("mousedown", select, false);

	setTimeout(() => {
		canvas.addEventListener("touchstart", restart, false);
		canvas.addEventListener("mousedown", restart, false);
	}, 2000);

	pairs = columns * rows / 2
	message = Math.floor(pairs - n/2) + ' von ' + pairs;

	randCardsInterval = setInterval(randCards, 250);
	endDrawInterval = setInterval(endDraw, 30, message);
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
	endCards.push(card);
}

function restart() {
	endCards = [];
	selection = [];
	canvas.removeEventListener("touchstart", restart, false);
	canvas.removeEventListener("mousedown", restart, false);
	clearInterval(randCardsInterval);
	clearInterval(endDrawInterval);
	if ( par.get('t')) {
		time = par.get('t');
	}
	else {
		time = 60;
	}
	init();
}

function initSelect(event) {
	log(event)
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
			end(0);
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

function endDraw(message) {
	ctx.globalAlpha = 0.4;
	ctx.font = FONT_SIZE + 'px ' + FONT;
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	rise();
	for(i in endCards) { endCards[i].draw(); }
	ctx.globalAlpha = 1;
	//ctx.fillText(message, canvas.width / 2, canvas.height / 2);
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
	ctx.fillStyle = '#999'
	ctx.fillRect (0,0, canvas.width * time/TIME, canvas.height/6)
	

	ctx.fillStyle = '#333';
	ctx.globalAlpha = 1;
	ctx.font = guiHeight * 0.7 + 'px ' + FONT;
	ctx.fillText('Immer ' + goal, canvas.width / 2, canvas.height / 12);
	//ctx.fillText(time, canvas.width / 2, canvas.height / 12);
	ctx.font = '180px ' + FONT;
	ctx.fillText(countdown, canvas.width / 2, (canvas.height + guiHeight) / 2);
}

function timer() {
	time--;
	if(time == 0) {
		end(new Set(cards).size - 1);
	}
}

function checkCollision() {
	for(i in cards) {
		for(j in cards) {
			if ( j == i ) { continue; }
			if ( Match.card(cards[i].x, cards[i].y, cards[j])) {
				cards[i].y = -10;
			}
		}
	}
}

function rise() {
	for(i in endCards) {
		endCards[i].velocity.y -= Physics.g * 0.1 ;
		endCards[i].y += endCards[i].velocity.y;
	}
}

function fall() {
	for(i in cards) {
		let collision = false;
		cards[i].velocity.y += Physics.g;
		for(j in cards) {
			if(cards[i].y + cards[i].h > canvas.height) {
				collision = true;
				cards[i].velocity.y = 0;
				cards[i].y = canvas.height - cards[i].h / 2;
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
			cards[i].y += Math.min(cards[i].velocity.y, cards[i].h * 0.7);
		}
	}
}

function createCards() {
	lineWidth = Math.round(canvas.width / columns);
	lineHeight = Math.round((canvas.height - guiHeight) / rows);
	FONT_SIZE = lineHeight * 0.6;
	for(let i = 0; i < columns; i++ ) {
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
		canvas.addEventListener("touchend", select, false);
		canvas.addEventListener("mousedown", select, false);
	}, 5000);
	setTimeout( () => {countdown = '' }, 5500);
	setTimeout( () => setInterval(collisionInterval = checkCollision, 3000), 2000);
}
