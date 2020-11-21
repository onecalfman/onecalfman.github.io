const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var FONT = "Grundschrift";
var FONT_SIZE = 60;
var IMG_SCALE = 0.8;
var SCALE = 0.8;
var charge = 2;
const CARD_SIZE = 265;
const BORDER = 5;
const CARDS_N = 5;
const epsilon = 5;

const speaker_img = new Image();
speaker_img.scr = '/anlaute/assets/speaker.png';

var speaker = new Image();
speaker.src = 'assets/speaker.png';
var restart_img = new Image();
restart_img.src = 'assets/restart.png';

const px = 'px ';
ctx.font = FONT_SIZE + px + FONT;
ctx.textBaseline = "hanging";

var cards = [];
var csv = [];
var lines = [];

var time_counter = 0;

colors = [ 
	'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
	'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
	'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
	'#9AD078', '#6DBFA9', '#F3B23C',
];

level = [
	[
		['A','a','assets/A_Affe.PNG','assets/A_Ameise.PNG','assets/snd/Ameise-Affe.mp3'],
		['E','e','assets/E_Elefant.PNG','assets/E_Ente.PNG','assets/snd/Elefant-Ente.mp3'],
		['I','i','assets/I_Igel.PNG','assets/I_Indiander.PNG','assets/snd/Igel-Indianer.mp3'],
		['O','o','assets/O_Oma.PNG','assets/O_Ordner_.PNG','assets/snd/Oma-Ordner.mp3'],
		['U','u','assets/U_Ufo.PNG','assets/U_Unfall.PNG','assets/snd/Ufo-Unfall.mp3'],
		['M','m','assets/M_Maus.PNG','assets/snd/Maus.mp3'],
		['L','l','assets/L_Loewe.PNG','assets/snd/Loewe.mp3'],
		['S','s','assets/S_Sonne.PNG','assets/snd/Sonne.mp3'],
	],
	[
		['W','w','assets/W_Wolke.PNG','assets/snd/Wolke.mp3'],
		['R','r','assets/R_Rakete.PNG','assets/snd/Rakete.mp3'],
		['F','f','assets/F_Feder.PNG','assets/snd/Feder.mp3'],
		['N','n','assets/N_Nadel.PNG','assets/snd/Nadel.mp3'],
		['T','t','assets/T_Tasse.PNG','assets/snd/Tasse.mp3'],
		['Au','au','assets/Au_Auto.PNG','assets/snd/Auto.mp3'],
		['Ei','ei','assets/Ei_Eis.PNG','assets/snd/Eis.mp3'],
	],
	[
		
		['H','h','assets/H_Hose.PNG','assets/snd/Hose.mp3'],
		['D','d','assets/D_Dino.PNG','assets/snd/Dino.mp3'],
		['Sch','sch','assets/Sch_Schaf.PNG','assets/snd/Schaf.mp3'],
		['K','k','assets/K_Kerze.PNG','assets/snd/Kerze.mp3'],
		['Z','z','assets/Z_Zaun.PNG','assets/snd/Zaun.mp3'],
		['P','p','assets/P_Pirat.PNG','assets/snd/Pirat.mp3'],
		['G','g','assets/G_Gabel.PNG','assets/snd/Gabel.mp3'],
		['J','j','assets/J_Jojo.PNG','assets/snd/Jo-Jo.mp3'],
		['Eu','eu','assets/Eu_Euro.PNG','assets/snd/Euro.mp3'],
	],
	[
		['Ä','ä','assets/Ae_Aepfel.PNG','assets/snd/Aepfel.mp3'],
		['B','b','assets/B_Banane.PNG','assets/snd/Banane.mp3'],
		['C','c','assets/C_Computer.PNG','assets/snd/Computer.mp3'],
		['Ch','ch','assets/Ch_Buch.PNG','assets/Ch_Milch.PNG','assets/snd/Buch-Milch.mp3'],
		['Ö','ö','assets/Oe_Oel.PNG','assets/snd/Oel.mp3'],
		['Pf','pf','assets/Pf_Pfeil.PNG','assets/snd/Pfeil.mp3'],
		['Qu','qu','assets/Qu_Qualle.PNG','assets/snd/Qualle.mp3'],
		['Sp','sp','assets/Sp_Spinne.PNG','assets/snd/Spinne.mp3'],
		['St','st','assets/St_Stempel.PNG','assets/snd/Stempel.mp3'],
		['Ü','ü','assets/Ue_Ueberraschungsei.PNG','assets/snd/Ueberraschungsei.mp3'],
		['V','v','assets/V_Vase.PNG','assets/V_Vogel.PNG','assets/snd/Vogel-Vase.mp3'],
		['X','x','assets/X_Xylophon.PNG','assets/snd/Xylophon.mp3'],
		['Y','y','assets/Y_Yak.PNG','assets/snd/Yack.mp3'],
	]

]

const par = new URLSearchParams(window.location.search);
	
if ( par.get('c')) { charge = par.get('c');}
if ( par.get('l')) { lvl = Math.floor(par.get('l'))
	for( let i = 0; i < lvl; i++) {
		lines = lines.concat(level[i]);
		console.log(level[i])
	}
}
else { lines = lines.concat(level[0],level[1],level[2],level[3]); }

var mousedown = false;
var movestart = [0,0]
var finished = false;
for (let i = 0; i <= CARDS_N; i++) { csv.push([]); }

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

function endcard ()
{
	ctx.fillStyle = randPred();
	ctx.fillStyle = '#000000';
	ctx.fillRect(canvas.width / 2 - CARD_SIZE, canvas.height / 2 - CARD_SIZE, CARD_SIZE * 2, CARD_SIZE * 2);
	console.log('end');
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

function move(time) {
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
			if ( cards[i].y < canvas.height * 0.04 || cards[i].y + cards[i].h > canvas.height * 0.96) { accy = 0; }
	
			cards[i].x += accx;
			cards[i].y += accy;
			}
		}
	}
	time_counter++;
	if ( Date.now() - time > 2000 ) { clearInterval(timer); }
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
			cards[cards.length - 1].add(i);
			//cards[i].add(cards.length - 1);
			draw();
			return;
		}
	}
	if ( card.x === movestart[0] && card.y === movestart[1] ) {
		if ( card instanceof Endcard) { 
			console.log('ending');
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
		this.w = CARD_SIZE * 0.7;
		this.h = CARD_SIZE * 0.7;
		//this.x = canvas.width / 2 - this.w / 2;
		//this.y = canvas.height / 2 - this.h / 2;
		this.x = canvas.width - this.w; 
		this.y = canvas.height - this.h;
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
			console.log('img');
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

		if (this.snd[0] ) {
			ctx.globalAlpha = 0.3;
			//ctx.drawImage(speaker, this.x, this.y, this.w, this.h);
			if ( this.txt[0] || this.img[0] ) {
				ctx.drawImage(speaker, this.x + this.w * 0.7, this.y, this.w * 0.3, this.h * 0.3);
			} else {
				ctx.drawImage(speaker, this.x, this.y, this.w, this.h);
			}
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
			ctx.font = FONT_SIZE + px + FONT;
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
	ctx.font = FONT_SIZE * SCALE + px + FONT;
	ctx.textBaseline = "hanging";

	for(let i = 0; i < CARDS_N; i++)
	{
		n = randInt(0,lines.length - 1);
		c = randInt(0,colors.length - 1);
		cells = lines[n];
		for( let j = 0; j < cells.length; j++)
		{
			cell = cells[j].trim();
			if ( cell.endsWith('png') || cell.endsWith('PNG') || cell.endsWith('jpg') || cell.endsWith('JPG')) {
			csv[i][j] = new Image();
			csv[i][j].onload = function() { 
				cards.unshift(new Card(i, csv[i][j].width, csv[i][j].height, 100)); 
				cards[0].img[0] = csv[i][j];
				draw();
			}
			csv[i][j].src = cell;
			} 
			else if  ( cell.endsWith('mp3') || cell.endsWith('wav'))
			{ 
				csv[i][j] = new Audio(cell);
				cards.push(new Card( i, 100 * SCALE, 100 * SCALE, 20));
				cards[cards.length - 1].snd[0] = csv[i][j];
				cards[cards.length - 1].color = randPred();
			} 
			else if ( /\S/.test(cell) )
			{
				csv[i][j] = cell;
				cards.push(new Card( i, ctx.measureText(cell).width * 1.4 , FONT_SIZE * 1.1, 20));
				cards[cards.length - 1].txt[0] = cell;
			}
		}
		lines.splice(n,1);
		colors.splice(c,1);
		if ( ! colors.length ) { recolor(); }

	}

	timer = setInterval(move, 5, Date.now());

	draw();

	canvas.onmousedown = function(event) { layer(event.clientX,event.clientY); };
	canvas.onmouseup = function(event) { mousedown = false; match(); };
	canvas.addEventListener("touchstart", function(event) { layer(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
	canvas.addEventListener("touchmove",  function(event) { drag(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
    	canvas.addEventListener("touchend",  function(event) {mousedown = false; match();});

	window.addEventListener("resize", function(event) {resize();}, true);
	draw();
}

