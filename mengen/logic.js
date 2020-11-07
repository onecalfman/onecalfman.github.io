const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const div = document.getElementById('div');

var num;
var set = 'augen';
var img = new Image;
var t = 700;
var ready = false;
var s;
var x_dim = 2
var y_dim = 2
var runden = 4;
var RIGHT = 0;
var WRONG = 0;
var n;
var buttons = [];
button = [];

var right = new Image;
var wrong = new Image;
var restart_img = new Image;


const par = new URLSearchParams(window.location.search);
if ( par.get('set'))    { set = par.get('set');}
if ( par.get('t'))      { t = par.get('t');}
if ( par.get('s'))	{ s = par.get('s');}
if ( par.get('r'))	{ runden = par.get('r');}

function randInt(min, max)	{
	return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
	}

function sleep(milliseconds) {
 return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function uniq(arr) {
counts = [];
for (let i = 0; i < arr.length; i++) {
    counts[arr[i][0]] = 1 + (counts[arr[i][0]] || 0);
}
return counts.length - 1;
}

function end() {
	ctx.fillStyle = colors[randInt(0,colors.length)]
	ctx.fillRect(0,0,canvas.width,canvas.height)

	message = Math.round(RIGHT / (RIGHT + WRONG) * 100) + '% richtig';
	message = RIGHT + ' von ' + (RIGHT + WRONG) + ' richtig';
	ctx.font = '80px Roboto';
	ctx.fillStyle = '#333333';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(message,canvas.width / 2 ,canvas.height / 2);
}

async function check(l) {
	ready = false;
	if (src[num][0] == l) {
		ctx.fillStyle = '#393';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(right,canvas.width / 2 - right.width / 2,canvas.height / 2 - right.height / 2);
		await sleep(t);
		ctx.globalAlpha = 1;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 0.4;
		ctx.drawImage(restart_img, canvas.width / 2 - restart_img.width / 2,canvas.height / 2 - restart_img.height / 2);
		RIGHT++;
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
		WRONG++;
	}
	
	ctx.globalAlpha = 1;
	if (RIGHT + WRONG >= runden) {
		end()
	}
	else {
		buttons = [];
		canvas.addEventListener('click', restart);
	}
}

function restart() {
	canvas.removeEventListener('click', restart);
	if ( s ) { t *= s }
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0,0,canvas.width,canvas.height)
	num = randInt(0,src.length - 1);
	img.onload = function() {show()};
	img.src = src[num][1];
}

colors = [ 
	'#86C9B7', '#87A7C7', '#94D0A1', '#8ECC85',
	'#F69856', '#F4A96D', '#90A8CC', '#93AACF',
	'#B67BB4', '#ABA9CE', '#F086A2', '#F1785B',
	'#9AD078', '#6DBFA9', '#F3B23C',
];

augen = [
	['1','assets/wuerfel/Wuerfelbilder_Blau_1.png'], 
	['2','assets/wuerfel/Wuerfelbilder_Blau_2.png'], 
	['3','assets/wuerfel/Wuerfelbilder_Blau_3.png'], 
	['4','assets/wuerfel/Wuerfelbilder_Blau_4.png'], 
	['5','assets/wuerfel/Wuerfelbilder_Blau_5.png'], 
	['6','assets/wuerfel/Wuerfelbilder_Blau_6.png'] 
]

finger = [
	['1','assets/finger/1-Finger_aussen_links.png'],
	['2','assets/finger/2-Finger aussen links.png'],
	['3','assets/finger/3-Finger_aussen_links.png'],
	['4','assets/finger/4-Finger_aussen_links.png'],
	['5','assets/finger/5-Finger_aussen_links.png'],
	['6','assets/finger/Linke_Hand_5_Zahl_6.png'],
	['7','assets/finger/Linke_Hand_5_Zahl_7.png'],
	['8','assets/finger/Linke_Hand_5_Zahl_8.png'],
	['9','assets/finger/Linke_Hand_5_Zahl_9.png'],
	['10','assets/finger/Linke_Hand_5_Zahl_10.png']
]

zehner = [
	['1','assets/zehner/ZF01-1-0.png'],
	['2','assets/zehner/ZF02-1-1.png'],
	['2','assets/zehner/ZF02-2-0.png'],
	['3','assets/zehner/ZF03-2-1.png'],
	['3','assets/zehner/ZF03-3-0.png'],
	['4','assets/zehner/ZF04-2-2.png'],
	['4','assets/zehner/ZF04-3-1.png'],
	['4','assets/zehner/ZF04-4-0.png'],
	['5','assets/zehner/ZF05-3-2.png'],
	['5','assets/zehner/ZF05-4-1.png'],
	['5','assets/zehner/ZF05-5-0.png'],
	['6','assets/zehner/ZF06-3-3.png'],
	['6','assets/zehner/ZF06-4-2.png'],
	['6','assets/zehner/ZF06-5-1.png'],
	['7','assets/zehner/ZF07-4-3.png'],
	['7','assets/zehner/ZF07-5-2.png'],
	['8','assets/zehner/ZF08-4-4.png'],
	['8','assets/zehner/ZF08-5-3.png'],
	['9','assets/zehner/ZF09-5-4.png'],
	['10','assets/zehner/ZF10-5-5.png']
]

if ( set == 'augen') { 
	src = augen; 
	document.getElementById("div").classList.toggle('grid3')
	src = augen;
} else if ( set == 'finger') { 
	src = finger; 
	document.getElementById("div").classList.toggle('grid5');
} else if ( set == 'zehner' ) {
	src = zehner;
	document.getElementById("div").classList.toggle('grid5');
}

function greet() {
	greeter = new Image;
	greeter.onload = function() { init(); }
	greeter.src = src[randInt(0,src.length - 1)][1];
}


async function show() {
	if ( img.width < img.height ) {
		y = canvas.height * 0.5;
		x = y * img.width / img.height;
	} else {
		x = canvas.width * 0.5;
		y = x * img.height / img.width;
	}

	ctx.drawImage(img, canvas.width / 2 - x / 2, 0, x, y);
	await sleep(t);
	ready = true;
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0,0,canvas.width,canvas.height)
	buttonCreate(uniq(src)/y_dim,y_dim,canvas.height / 2);
}

function setup() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	canvas.removeEventListener('click', setup);
	restart();
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

function buttonCreate(x_dim,y_dim,height) {
	total_w = window.innerWidth;
	total_h = window.innerHeight - height;

	ctx.font = '70px Roboto';
	ctx.fillStyle = '#333333';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	w = Math.ceil(total_w/x_dim);
	h = Math.ceil(total_h/y_dim);
	for(let i = 0; i < y_dim; i++) {
		if (n && i == y_dim - 1 && n < x_dim * y_dim) {
			n_last_row = n - x_dim * (y_dim - 1);
			w = Math.ceil(total_w/n_last_row);
		}
		for(let j = 0; j < x_dim; j++) {
			ctx.fillStyle = colors[randInt(0,colors.length-1)];
			x = Math.floor(j * w);
			y = Math.floor(i * h);
			ctx.fillRect(x,height + y,w,h);
			ctx.fillStyle = '#333333';
			buttons.push([x,height + y,x + w,height + y + h]);
			ctx.fillText(buttons.length, x + w / 2,height + y + h/2);
		}
	}
	canvas.addEventListener('click', buttonEval);
}

function init() {
	titelmaus = new Image;
	if ( window.innerHeight < window.innerWidth  ) {
		ctx.canvas.width = window.innerHeight;
		ctx.canvas.height = window.innerHeight;
	} else {
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerWidth;
	}
	titelmaus.onload = function() {
		ctx.drawImage(titelmaus, 0,0, canvas.width, canvas.height);
		if ( greeter.width < canvas.height * 2) {
			greeter_y_dim = canvas.height * 0.3;
			greeter_x_dim = canvas.height * 0.3 * greeter.width / greeter.height;
		} else {
			greeter_x_dim = canvas.width * 0.5;
			greeter_y_dim = canvas.height * 0.5 * greeter.height / greeter.width;
		}
		ctx.fillStyle = '#EEEEEE';
		ctx.globalAlpha=0.4;
		ctx.fillRect(canvas.width * 0.48 - greeter_x_dim / 2, canvas.height * 0.6 - greeter_y_dim / 2, greeter_x_dim, greeter_y_dim);
		ctx.globalAlpha=0.7;
		ctx.drawImage(greeter, canvas.width * 0.48 - greeter_x_dim / 2, canvas.height * 0.6 - greeter_y_dim / 2, greeter_x_dim, greeter_y_dim);
		canvas.addEventListener('click', setup);
	};

	titelmaus.src = 'assets/Titelmaus.png'
	right.src = 'assets/right.png';
	wrong.src = 'assets/wrong.png';
	restart_img.src = 'assets/restart.png';
}
