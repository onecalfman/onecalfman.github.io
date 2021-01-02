const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var bgColor = '#ccbd97';
var FONT = "Grundschrift";
var FONT_SIZE;

var cards = [];
var buttons = [];
var cheeses = [];
var backgroundCards = [];
var task;

var grid;
var level = [];
var n = 3;
var levelWidth;
var levelHeight;
var player;

var playerImg = new Image();
playerImg.src = 'assets/player.png';
var cheese = new Image();
cheese.src = 'assets/cheese.png';
var wall = [new Image(), new Image(), new Image(), new Image()];
wall[0].src = 'assets/pflanze.png'
wall[1].src = 'assets/pflanze2.png'
wall[2].src = 'assets/ananaspflanze.png'
wall[3].src = 'assets/felsen.png'
var target = new Image();
target.src = 'assets/ziel.png';
var background = new Image();
background.src = 'assets/bg.png';

var colors = [ 
	'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
	'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
	'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
	'#9AD078', '#6DBFA9', '#F3B23C',
];

const par = new URLSearchParams(window.location.search);
if ( par.get('l')) { n = par.get('l');}

function draw() {
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	for(i in backgroundCards) { backgroundCards[i].draw(); }
	for(i in cards) { cards[i].draw(); }
	for(i in buttons) { buttons[i].draw(); }
	for(i in cheeses) { cheeses[i].draw(); }
	player.draw();
}


function collision(card) {
	let solid = 'xo';
	let target = 'g';
	for(i in cards) {
		if(cards[i] === card) { continue; }
		if(card.x === cards[i].x && card.y === cards[i].y) {
			if (solid.includes(cards[i].group)) { return [1, i]; }
			else { return [2, i]; }
		}
	}
	return false;
}

function touchControlls() {
	areaD = Math.min(canvas.height - levelHeight * grid, canvas.width * 0.8);
	size = areaD / 4;
	middleX = canvas.width / 2;
	middleY = canvas.height - 2 * size;

	left = function() { move({keyCode : 37}) }
	up = function() { move({keyCode : 38}) }
	right = function() { move({keyCode : 39}) }
	down = function() { move({keyCode : 40}) }

	buttons.push(new Button(middleX - size, middleY, size, size, left));
	buttons.push(new Button(middleX, middleY - size, size, size, up));
	buttons.push(new Button(middleX + size, middleY, size, size, right));
	buttons.push(new Button(middleX, middleY + size, size, size, down));
}

function button(event) {
	for(i in buttons) {
		if(Match.card(event.clientX,event.clientY,buttons[i])) {
			buttons[i].action();
		}
	}
}

function move(event) {
	document.removeEventListener('keydown', move);
	let pos = {x: player.x, y: player.y};
	switch(event.keyCode) {
		case 37 : player.x -= grid; player.orientation = 'l';	break;
		case 38 : player.y -= grid; player.orientation = 'u';	break;
		case 39 : player.x += grid; player.orientation = 'r';	break;
		case 40 : player.y += grid; player.orientation = 'd';	break;
	}
	let i = collision(player);
	if(i[0] == 1) {
		i = i[1];
		switch(cards[i].group) {
			case 'x' : 
				player.x = pos.x;
				player.y = pos.y;
				break;
			case 'o' :
				cardPos = { x: cards[i].x, y: cards[i].y }
				cards[i].x += player.x - pos.x;
				cards[i].y += player.y - pos.y;
				let j = collision(cards[i]);
				if(j[0] == 1) {
					j = j[1];
					if ( cards[j].group == 'g' ) {
						cards[i].color = randPred();
						cards[i].alpha = 1;
						break;
					}
					cards[i].x = cardPos.x;
					cards[i].y = cardPos.y;
					player.x = pos.x;
					player.y = pos.y;
				}
				break;
		}
	}

	draw();
	setTimeout(() => { document.addEventListener('keydown', move); }, 50);
}

function addCheese(card,c,r) {
	card.x = Math.round(grid / 2 + grid * c);
	card.y = Math.round(grid / 2 + grid * r);
	card.img[0] = cheese;
	card.txt[0] = task[cheeses.length];
	card.draw = function() {
		PlaceImg.center(this.img[0], this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		ctx.fillStyle = '#333';
		ctx.font = FONT_SIZE + 'px ' + FONT;
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle';
		ctx.fillText(card.txt[0], this.x, this.y+this.h*0.15);
	}
	cheeses.push(card);
	cards.push(card);
}

function createBackground() {
	for(let r = 0; r <= Math.ceil(canvas.height/grid); r+=3) {
		for(let c = 0; c <= Math.ceil(canvas.width/grid); c+=3) {
			log('card');
			bg_card = new Card('b',3*grid,3*grid);
			bg_card.img[0] = background;
			bg_card.x = Math.round(grid / 2 + grid * c);
			bg_card.y = Math.round(grid / 2 + grid * r);
			backgroundCards.push(bg_card);
		}
	}
}

function createLevel() {
	for(let r = 0; r < levelHeight; r++) {
		for(let c = 0; c < level[r].length; c++) {
			card = new Card(level[r][c],grid,grid);
			switch(level[r][c]) {
				case 'x': card.img[0] = wall[randInt(0,1)]; break;
				case 'o': addCheese(card,c,r); continue; break;
				case 'p': card.img[0] = playerImg; break;
				case 'g': card.img[0] = target; break;
				case ' ':   continue; 	       break;
				default : card.color = '#449'; break;
			}
			card.x = Math.round(grid / 2 + grid * c);
			card.y = Math.round(grid / 2 + grid * r);

			if ( level[r][c] == 'p') {
				player = card;	
				player.alpha = 1;
				player.orientation = 'u';
				player.draw = function() {
					let rad = 0;
					switch(this.orientation) {
						case 'u': rad = 0; 		break;
						case 'r': rad = Math.PI / 2; 	break;
						case 'd': rad = Math.PI; 	break;
						case 'l': rad = Math.PI * 1.5;  break;
					}
					PlaceImg.rotate(this.img[0], this.x, this.y, this.w, this.h, rad);
				}
			}
		if ( card.group == 'g' ) { cards.unshift(card); }
		else { cards.push(card); }
		}
	}
	draw();
}

function parseLevel(text) {
	task = text.split('#')[1].replaceAll('\n','').replaceAll(' ','');
	text = text.split('#')[0];
	level.push([]);
	let row = 0;
	for(i in text) {
		if(text[i] == '\n') {
			row++;
			level.push([]);
		}
		else {
			level[row].push(text[i]);
		}
	}
	if(text[text.length-1] == '\n') { level.pop(); }
	return level;
}

function initLevel(n) {
	url = 'level/' + n;
	fetch(url).then(function(response) {
		response.text().then(function(text) {
			level = parseLevel(text);
			levelWidth = Math.max(...level.map(a=>a.length));
			levelHeight = level.length;
			grid = Math.round(Math.min(canvas.width/levelWidth, canvas.height/levelHeight));
			FONT_SIZE = grid * 0.8;
			if(isTouchDevice) { touchControlls(); }
			createBackground();
			createLevel();
		});
	});
}

function init() {
	initLevel(n);
	document.addEventListener('keydown', move);
	document.addEventListener('mousedown', button);
	document.addEventListener('touchend', button);
}
