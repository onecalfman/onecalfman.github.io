const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const div = document.getElementById('div');

if ( window.innerHeight * 2/3 < window.innerWidth  ) {
	ctx.canvas.width = window.innerHeight * 2/3;
	ctx.canvas.height = window.innerHeight * 2/3;
} else {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerWidth;
}

var num;
var set = 'augen';
var img = new Image;
var t = 700;
var ready = false;
var s;

right = new Image;
wrong = new Image;
restart_img = new Image;

right.src = 'assets/right.png';
wrong.src = 'assets/wrong.png';
restart_img.src = 'assets/restart.png';

button = [];

const par = new URLSearchParams(window.location.search);
if ( par.get('set'))    { set = par.get('set');}
if ( par.get('t'))      { t = par.get('t');}
if ( par.get('s'))	{ s = par.get('s');}

function randInt(min, max)	{
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
	}

function sleep(milliseconds) {
 return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function log(l) {
	ready = false;
	for( let i = 0; i < src.length; i++) {
		document.getElementsByTagName("button")[i].classList.toggle('button'); 
		document.getElementsByTagName("button")[i].classList.toggle('inactive'); 
	}
	if (num == l) {
		ctx.fillStyle = '#393';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(right,canvas.width / 2 - right.width / 2,canvas.height / 2 - right.height / 2);
		await sleep(t);
		ctx.globalAlpha = 1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(restart_img, canvas.width / 2 - restart_img.width / 2,canvas.height / 2 - restart_img.height / 2);
	}
	else { 
		ctx.fillStyle = '#933';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(wrong,canvas.width / 2 - wrong.width / 2,canvas.height / 2 - wrong.height / 2);
		await sleep(t);
		ctx.fillStyle = '#933';
		ctx.globalAlpha = 1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(restart_img, canvas.width / 2 - restart_img.width / 2,canvas.height / 2 - restart_img.height / 2);
	}
	
	ctx.globalAlpha = 1;
	canvas.addEventListener('click', restart);
}

function restart() {
	canvas.removeEventListener('click', restart);
	start();
	if ( s ) { t *= 0.98 }
}

augen = [
	'assets/wuerfel/Wuerfelbilder_Blau_1.png', 
	'assets/wuerfel/Wuerfelbilder_Blau_2.png', 
	'assets/wuerfel/Wuerfelbilder_Blau_3.png', 
	'assets/wuerfel/Wuerfelbilder_Blau_4.png', 
	'assets/wuerfel/Wuerfelbilder_Blau_5.png', 
	'assets/wuerfel/Wuerfelbilder_Blau_6.png', 
]

finger = [
	'assets/finger/1-Finger_aussen_links.png',
	'assets/finger/2-Finger aussen links.png',
	'assets/finger/3-Finger_aussen_links.png',
	'assets/finger/4-Finger_aussen_links.png',
	'assets/finger/5-Finger_aussen_links.png',
	'assets/finger/Linke_Hand_5_Zahl_6.png',
	'assets/finger/Linke_Hand_5_Zahl_7.png',
	'assets/finger/Linke_Hand_5_Zahl_8.png',
	'assets/finger/Linke_Hand_5_Zahl_9.png',
	'assets/finger/Linke_Hand_5_Zahl_10.png',
]

if ( set == 'augen') { src = augen; 
	document.getElementById("div").classList.toggle('grid3')
	src = augen;
}
else if ( set = 'finger') { 
	document.getElementById("div").classList.toggle('grid5');
	src = finger; 
}


for (let i = 0; i < src.length; i++) {
	button[i] = document.createElement("button");
	button[i].innerHTML = i + 1;
	div.appendChild(button[i]);
	button[i].addEventListener ("click", function() { if ( ready ) { log(i+1); } });
	document.getElementsByTagName("button")[i].classList.toggle('inactive'); 

}

async function show() {
	if ( img.width < img.height ) {
		y = canvas.height;
		x = y * img.width / img.height;
	} else {
		x = canvas.width;
		y = x * img.height / img.width;
	}

	ctx.drawImage(img, canvas.width / 2 - x / 2, canvas.height  / 2- y / 2, x, y);
	await sleep(t);
	ready = true;
	for( let i = 0; i < src.length; i++) {
		document.getElementsByTagName("button")[i].classList.toggle('button'); 
		document.getElementsByTagName("button")[i].classList.toggle('inactive'); 
	}
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0,0,canvas.width,canvas.height)
}

function start() {
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0,0,canvas.width,canvas.height)
	num = randInt(0,src.length - 1);
	img.onload = function() {show()};
	img.src = src[num];
	num++;
}
