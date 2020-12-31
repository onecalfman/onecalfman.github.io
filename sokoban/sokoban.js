const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var bgColor = '#ddd';
var FONT = "Grundschrift";

var cards = [];
var buttons = [];

var grid;
var level;
var n = 3;
var levelWidth;
var levelHeight;
var player;

var colors = [ 
	'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
	'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
	'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
	'#9AD078', '#6DBFA9', '#F3B23C',
];

function draw() {
	ctx.fillStyle = bgColor;
	ctx.fillRect(0,0,canvas.width, canvas.height);
	for(i in cards) { cards[i].draw(); }
	for(i in buttons) { buttons[i].draw(); }
	player.draw();
}


function collision(card) {
	for(i in cards) {
		if(cards[i] === card) { continue; }
		if(card.x === cards[i].x && card.y === cards[i].y) { return i; }
	}
	return false;
}

function touchControlls() {

	areaD = Math.min(canvas.height - levelHeight * grid, canvas.width * 0.8);
	middleX = canvas.width / 2;
	middleY = levelHeight * grid + areaD / 2;
	size = areaD / 4;

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
	let direction = '';
	let pos = {x: player.x, y: player.y};
	switch(event.keyCode) {
		case 37 : player.x -= grid; direction = 'l';	break;
		case 38 : player.y -= grid; direction = 'u';	break;
		case 39 : player.x += grid; direction = 'r';	break;
		case 40 : player.y += grid; direction = 'd';	break;
	}
	let i = collision(player);
	if(i) {
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
				if(j) {
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

function createLevel() {
	let i = 0;
	for(let c = 0; c < levelWidth; c++) {
		for(let r = 0; r < levelHeight; r++) {
			card = new Card(level[i],grid,grid);
			switch(level[i]) {
				case 'x': card.color = '#666'; break;
				case 'o': card.color = '#996'; break;
				case 'p': card.color = '#696'; break;
				case 'g': card.color = '#111'; break;
				case ' ': i++;       continue; break;
				default : card.color = '#449'; break;
			}
			card.x = Math.round(grid / 2 + grid * r);
			card.y = Math.round(grid / 2 + grid * c);
			if ( level[i] == 'p') {
				card.alpha = 1;
				player = card;	
			}
			cards.push(card);
			i++;
		}
	}
	draw();
}

function initLevel(n) {
	url = 'level/' + n;
	fetch(url).then(function(response) {
		response.text().then(function(text) {
			level = text;
			levelWidth = level.indexOf('\n');
			levelHeight = level.length / levelWidth - 1;
			grid = Math.round(Math.min(canvas.width/levelWidth, canvas.height/levelHeight));
			level = level.replaceAll('\n','');
			if(isTouchDevice) { touchControlls(); }
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
