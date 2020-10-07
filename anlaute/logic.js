const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//const PAIRS = 'pairs.csv';
const PAIRS = 'anlaute.csv';
var FONT_SIZE = 80;
var IMG_SCALE = 1;
var SCALE = 1;
const BORDER = 5;
const CARDS_N = 5;

const speaker_img = new Image();
speaker_img.scr = '/anlaute/assets/speaker.png';

var speaker = new Image();
speaker.src = 'assets/speaker.png';

ctx.font = FONT_SIZE + 'px sans';
ctx.textBaseline = "hanging";

var cards = [];
var csv = []

colors = [ 
	'#86C9B7',
	'#87A7C7',
	'#94D0A1',
	'#8ECC85',
	'#AAAAAA',
	'#F69856',
	'#F4A96D',
	'#90A8CC',
	'#93AACF',
	'#B67BB4',
	'#ABA9CE',
	'#F086A2',
	'#F1785B',
	'#9AD078',
	'#6DBFA9',
	'#F3B23C',
];

var mousedown = false;
var movestart = [0,0]
for (let i = 0; i <= CARDS_N; i++) { csv.push([]); }

window.mobileCheck = function() { let check = false; (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera); return check; };

//if (window.mobileCheck()) {
//	var FONT_SIZE = FONT_SIZE * 0.5
//	ctx.font = FONT_SIZE + 'px sans';
//	var SCALE = 0.38;
//	var IMG_SCALE = 0.38;
//}


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


function unite(p)
{
	a = cards.length - 1;
	if ( cards[a] instanceof United ) { 
		cards[a].add(p);

	}
	else if ( cards[p] instanceof United ) {
		cards[p].add(a);
	}
	else {
		if ( cards[a].w <= cards[p].w) { w = cards[p].w; } else { w = cards[a].w; }
		if ( cards[a].h <= cards[p].h) { h = cards[p].h; } else { h = cards[a].h; }
		u = new United(cards[a].group, cards[a].x, cards[a].y, w, h);
		u.add(a);
		u.add(p);
		cards.push(u);
	}
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
	if ( card.x === movestart[0] && card.y === movestart[1] ) {
		if ( card instanceof SoundCard ) { card.play(); };
		if ( card instanceof United && card.snd ) { card.play(); };
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
	this.img = img;
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
	this.h = 100 * SCALE;
	this.w = 100 * SCALE;
	this.x = randInt(0, canvas.width - this.w);
	this.y = randInt(0, canvas.height - this.h);
	this.snd = snd;
	this.color = randPred();
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 0.2;
		ctx.drawImage(speaker, this.x, this.y, this.w, this.h);
		ctx.globalAlpha = 1;
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
	this.color = randPred();
	this.img = [];
	this.snd = [];
	this.txt = [];
	}

	add(n)
	{
		if ( cards[n].img ) {
			this.img.push(cards[n].img);
			this.w = 265 * SCALE;
			this.h = 265 * SCALE;
		}
		if ( cards[n].snd ) {
			this.snd.push(cards[n].snd);
			this.color = cards[n].color;
		}
		if (cards[n].txt) {
			this.txt.push(cards[n].txt);
		}
		
		cards.splice(n,1);
	}

	draw()
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		var imgl = this.img.length;
		for ( let i = 0; i < imgl; i++) {
			if ( imgl === 1 ) { 
				var offsetX = this.w / 2 - this.img[0].width * IMG_SCALE / 2;
				var offsetY = this.h / 2 - this.img[0].height * IMG_SCALE / 2;
			} else {
				var offsetX = i * this.w / 2 + 0.07 * this.w;
				var offsetY = i * (this.h - FONT_SIZE * 1.2) / 2 + 0.07 * this.w;
			}
			ctx.drawImage(this.img[i], this.x + offsetX, this.y + offsetY, this.img[i].width / imgl* IMG_SCALE , this.img[i].height / imgl * IMG_SCALE );
		}

		if (this.snd[0] ) {
			ctx.globalAlpha = 0.3;
			//ctx.drawImage(speaker, this.x, this.y, this.w, this.h);
			ctx.drawImage(speaker, this.x + this.w * 0.7, this.y, this.w * 0.3, this.h * 0.3);
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
			ctx.font = FONT_SIZE + 'px sans';
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
	lines = open(PAIRS).split('\n')
	
	for(let i = 0; i <= CARDS_N; i++)
	{
		n = randInt(0,lines.length - 1);
		c = randInt(0,colors.length - 1);
		cells = lines[n].split(',');
		for( let j = 0; j < cells.length; j++)
		{
			cell = cells[j].trim();
			if ( cell.endsWith('png') || cell.endsWith('PNG') || cell.endsWith('jpg') || cell.endsWith('JPG')) {
			csv[i][j] = new Image();
			csv[i][j].onload = function() { cards.push(new ImageCard(i,csv[i][j])); draw();}
			csv[i][j].src = cell;
			} 
			else if  ( cell.endsWith('mp3') || cell.endsWith('wav'))
			{ 
				csv[i][j] = new Audio(cell);
				cards.push(new SoundCard(i,csv[i][j]));
			} 
			else if ( /\S/.test(cell) )
			{
				csv[i][j] = cell;
				cards.push(new TextCard(i,cell));
			}
		}
		lines.splice(n,1);
		colors.splice(c,1);
	}

	draw();

	canvas.onmousedown = function(event) { layer(event.clientX,event.clientY); };
	canvas.onmouseup = function(event) { mousedown = false; match(); };
	canvas.addEventListener("touchstart", function(event) { layer(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
	canvas.addEventListener("touchmove",  function(event) { drag(event.changedTouches[0].pageX, event.changedTouches[0].pageY)});
    	canvas.addEventListener("touchend",  function(event) {mousedown = false; match();});

	window.addEventListener("resize", function(event) {resize();}, true);
	draw();
}
