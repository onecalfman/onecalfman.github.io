const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const par = new URLSearchParams(window.location.search);



var num;
var set = 'augen';
var img = new Image;
var t = 300;
right = new Image;
wrong = new Image;

right.src = 'assets/right.png'
wrong.src = 'assets/wrong.png'

if ( par.get('set'))          { set = par.get('set');}
if ( par.get('t'))          { t = par.get('t');}

function randInt(min, max)	{
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
	}

function sleep(milliseconds) {
 return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function log(l) {
	if (num == l) {
		console.log('richtig');
		ctx.drawImage(right,canvas.width / 2 - right.width / 2,canvas.height / 2 - right.height / 2);
	}
	else { 
		console.log('falsch'); 
		ctx.drawImage(wrong,canvas.width / 2 - wrong.width / 2,canvas.height / 2 - wrong.height / 2);
	}
}

async function overdraw() {
	await sleep(t);
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0,0,canvas.width,canvas.height)
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

if ( set == 'augen') { src = augen; }
else if ( set = 'finger') { src = finger; }

function show() {
	ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height  / 2- img.height / 2);
	overdraw();
}

function start() {
	num = randInt(0,src.length - 1);
	img.onload = function() {show()};
	img.src = src[num];
	num++;
}
