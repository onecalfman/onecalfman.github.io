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
var targets = [];
var backgroundCards = [];
var task;

var grid;
var level = [];
var levelNum = 1;
log(levelNum);
var levelWidth;
var levelHeight;
var player;

var playerImg = new Image();
playerImg.src = 'assets/player.svg';
var cheese = new Image();
cheese.src = 'assets/cheese.svg';
var wall = [new Image(), new Image(), new Image(), new Image()];
//wall[0].src = 'assets/pflanze.png'
//wall[1].src = 'assets/pflanze2.png'
wall[0].src = 'assets/pflanze.svg'
wall[1].src = 'assets/pflanze2.svg'
//wall[2].src = 'assets/ananaspflanze.png'
//wall[3].src = 'assets/felsen.png'
var target = new Image();
target.src = 'assets/ziel.png';
var background = new Image();
background.src = 'assets/bg.png';
var arrow = new Image();
arrow.src = 'assets/arrow.svg';

const par = new URLSearchParams(window.location.search);
if ( par.get('l')) { levelGroup = par.get('l');}

function draw() {
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	for(i in backgroundCards) { backgroundCards[i].draw(); }
	for(i in cards) { cards[i].draw(); }
	for(i in targets) { targets[i].draw(); }
	for(i in buttons) { buttons[i].draw(); }
	for(i in cheeses) { cheeses[i].draw(); }
	player.draw();
}

async function end() {
	log('end')
	document.removeEventListener('keydown', move);
	document.removeEventListener('mousedown', button);
	document.removeEventListener('touchend', button);
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = '#333';
	ctx.fillText('Richtig!', this.w / 2, this.h / 2);
	setTimeout(restart,2000);
}

function restart() {
	log(levelNum);
	levelNum++;
	log(levelNum);
	level = [];
	cards = [];
	buttons = [];
	cheeses = [];
	targets = [];
	backgroundCards = [];
	task;
	init();
	log('restart');
}

function collision(card,pos) {
	if (card === player) {
		for(i in cheeses) {
			if(card.x == cheeses[i].x && card.y == cheeses[i].y) {
				if(cheeses[i].fixed) {
					player.x = pos.x;
					player.y = pos.y;
					return;
				}
				cheesePos = { x: cheeses[i].x, y: cheeses[i].y }
				cheeses[i].x += player.x - pos.x;
				cheeses[i].y += player.y - pos.y;
				collision(cheeses[i],cheesePos);
			}
		}
		for(i in cards) {
			if(card.x == cards[i].x && card.y == cards[i].y) {
				player.x = pos.x;
				player.y = pos.y;
				return;
			}
		}
	}
	else {
		let solid = cards.concat(cheeses);
		for(i in solid) {
			if(card != solid[i] && card.x == solid[i].x && card.y == solid[i].y) {
				player.x -= card.x - pos.x;
				player.y -= card.y - pos.y;
				card.x = pos.x;
				card.y = pos.y;
				return;
			}
		}
		for(i in targets) {
			if(card.x == targets[i].x && card.y == targets[i].y) {
				let solution = [];
				targets[i].value  = card.group.toString();
				for(t in targets) {
					if(targets[t].value) solution.push(targets[t].value);
				}
				if(solution.length == targets.length) {
					if (solutionEval(solution)) {
						log("solved");
						end();
					} else { 
						log("false");
						levelNum--;
						end();
					}
				}
			}
		}
	}
	draw();
}

function sortBy(arr) {
	arr.sort(function(a, b) {
  		var keyA = new Date(a.ontarget),
    		keyB = new Date(b.ontarget);
  		if (keyA < keyB) return -1;
  		if (keyA > keyB) return 1;
  		return 0;
	});
	return arr;
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

	for(i in buttons) {
		buttons[i].img = arrow;
		buttons[i].draw = function() {
				PlaceImg.rotate(this.img, this.x, this.y, this.w, this.h, i * Math.PI / 2);
		}
	}
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
	collision(player, pos);
	draw();
	setTimeout(() => { document.addEventListener('keydown', move); }, 50);
}

function termEval(arr) {
	log("termEval: " + arr);
	if(arr.length == 1) return parseInt(arr[0]);
	if(arr[1] == '+') return parseInt(arr[0]) + parseInt(arr[2]);
	if(arr[1] == '-') return parseInt(arr[0]) - parseInt(arr[2]);
}

function solutionEval(arr) {
	log(arr);
	let eqIndex = arr.indexOf('=');
	let left = arr.slice(0,eqIndex);
	let right = arr.slice(eqIndex+1,arr.length);
	log(left);
	log(right);
	if(termEval(left) == termEval(right)) return true;
	return false;
}

function createUnmovableCheese(card,c,r) {
	card.x = Math.round(grid / 2 + grid * c);
	card.y = Math.round(grid / 2 + grid * r);
	card.img[0] = target;
	card.img[1] = cheese;
	card.group = task[cheeses.length];
	card.ontarget = targets.length.toString();
	card.fixed = true;
	card.draw = function() {
		PlaceImg.center(this.img[0], this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		PlaceImg.center(this.img[1], this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		ctx.fillStyle = '#333';
		ctx.font = FONT_SIZE + 'px ' + FONT;
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle';
		ctx.fillText(card.group, this.x, this.y+this.h*0.15);
	}
	cheeses.push(card);
	card.value = card.group;
	targets.push(card);
}

function createCheese(card,c,r) {
	card.x = Math.round(grid / 2 + grid * c);
	card.y = Math.round(grid / 2 + grid * r);
	card.img[0] = cheese;
	card.group = task[cheeses.length];
	card.draw = function() {
		PlaceImg.center(this.img[0], this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		ctx.fillStyle = '#333';
		ctx.font = FONT_SIZE + 'px ' + FONT;
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle';
		ctx.fillText(card.group, this.x, this.y+this.h*0.15);
	}
	cheeses.push(card);
}

function createBackground() {
	for(let r = 0; r <= Math.ceil(canvas.height/grid); r+=3) {
		for(let c = 0; c <= Math.ceil(canvas.width/grid); c+=3) {
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
				case 'o': createCheese(card,c,r); continue; break;
				case 'u': createUnmovableCheese(card,c,r); continue; break;
				case 'a': card.img[0] = playerImg; break;
				case 'z': card.img[0] = target; break;
				case ' ':   continue; 	       break;
				default : card.color = '#449'; break;
			}
			card.x = Math.round(grid / 2 + grid * c);
			card.y = Math.round(grid / 2 + grid * r);

			if ( level[r][c] == 'a') {
				player = card;	
				player.group = 'player';
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
				continue;
			}
		if ( card.group == 'z' ) {
			targets.push(card);
		}
		else if ( card.group == 'x' ) {
			cards.push(card);
		}
		else { cards.push(card); }
		}
	}
	draw();
}

function parseLevel(text) {
	task = text.split('#')[1].replaceAll('\n','').replaceAll(' ','');
	text = text.split('#')[0];
	if ( task.includes(',') ) { task = task.split(','); }
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

function initLevel(levelNum) {
	url = 'level/' + levelNum;
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
			log("level " + levelNum + " created");
		});
	});
}

function init() {
	log("init");
	initLevel(levelNum);
	document.addEventListener('keydown', move);
	document.addEventListener('mousedown', button);
	document.addEventListener('touchend', button);
	setTimeout(draw, 10);
	setTimeout(draw, 200);
	setTimeout(draw, 500);
}
