// NICHT ÄNDERN
var PUNKTE = 0;

//======================================================
// Standartwerte für das Spiel
// Zeilen mit var am anfang können über URL Parameter geändert werden
// Zeilen mit const können nur direkt in dieser Datei geändert werden

// Grundlegendes
var REIHE = 7;				// Einmaleinsreihe
var GAME_DURATION = 60;			// Spieldauer
var WINNING_PERCENTAGE = 0.75;		// Prozentzahl der richtigen Ergebnisse die zum Gewinnen gefangen werden müssen

// Schwierigkeit
var ROBOT_SPEED = 30;			// Laufgeschwindigkeit
var GRAVITY = 3;			// Fallgeschwindigkeit der Zahnräder
var MAX_GEAR_SCALE = 2;			// Multiplikator für die Maximalanzahl der Zahnräder auf dem Bildschirm
var GEAR_SPAWN_INTERVAL = 2;		// Zeitspanne zwischen dem Erscheinen neuer Zahnräder in s
var FPS = 30;				// Spielgeschwindigket / FPS (Frames per Second)

// Optik
var FONT_SCALE = 1.75;			// Scalierung der Restzeit und Punktzahl
var FONT_MAX = 35; 			// Maximale Schriftgröße in px

const FONT_COLOR = '#ddd';		// schriftfarbe in hexadecimal (Rot, Grün, Blue)
const GEAR_FONT_COLOR = '#000';		// schriftfarbe der Zahnradzahlen
const RIGHT_COLOR = '#393';		// Farbe beim einsammeln richtiger Ergebnisse
const WRONG_COLOR = '#933';		// Farbe bei falschen Ergenissen
const BACKGROUND_COLOR = '#444';	// Hintergrundfarbe
const FLOATING_SPEED = 3;		// Geschwindigkeit des Schwebens
const FLOATING_AMPLITUDE = 0.01; 	// Amplitude des Schwebens als Prozent der Browserfensterhöhe
const ENDCARD_FLOATING_AMP_HAPPY = 0.3;	// Amplitude des Schwebens beim guten Ende
const ENDCARD_FLOATING_AMP_SAD = 0.1;	// Amplitude des Schwebens beim schlechten Ende
const ALPHA_SPEED = 0.2;		// Geschwindigkeit des Ausblendes beim Fangen

const REIHE_INFO = "Vielfache von " + REIHE;
// Die Nachricht auf dem Endbildschirm kann noch nicht angepasst werden.
// TODO Implementieren
var END_MESSAGE = "Du hast " + PUNKTE + " erreicht!";

// Größe von Spielelmenten
var ROBOT_W = 200; 			// Breite des Roboters in px
var ROBOT_H = ROBOT_W * 0.83;		// Höhe des Robots (wird automatisch berechnet)
var GEAR_SCALE = 1; 			// Scalierung der Zahnradgröße (wird anhand der Robotergröße Berechnet

// NICHT ÄNDERN
// LIEST PARAMETER AUS DER URL AUS
const par = new URLSearchParams(window.location.search);
	
if ( par.get('reihe')) 		{ REIHE = Math.floor(par.get('reihe'));}  
if ( par.get('dauer'))		{ GAME_DURATION = par.get('dauer'); }  
if ( par.get('prozent')) 	{ WINNING_PERCENTAGE = par.get('prozent'); }  
if ( par.get('speed')) 		{ ROBOT_SPEED = Math.floor(par.get('speed')); }  
if ( par.get('schwerkraft')) 	{ GRAVITY = Math.floor(par.get('schwerkraft')); }  
if ( par.get('max')) 		{ MAX_GEAR_SCALE = par.get('max'); }  
if ( par.get('interval')) 	{ GEAR_SPAWN_INTERVAL = par.get('interval'); }  
if ( par.get('fps')) 		{ FPS = Math.floor(par.get('fps')); }  
if ( par.get('font_scale')) 	{ FONT_SCALE = par.get('font_scale'); }  
if ( par.get('font_max')) 	{ FONT_MAX = Math.floor(par.get('font_max')); }
if ( par.get('breite')) 	{ ROBOT_W = Math.floor(par.get('breite'));	ROBOT_H = Math.floor(ROBOT_W * 0.83); }  
if ( par.get('zr_scale')) 	{ GEAR_SCALE = par.get('zr_scale'); }  

// Korrekturkonstante, damit bei größeren Reihen ca. 1/3 richtige Zahnräder erscheinen
var CORRECTION;  			
switch (REIHE) {
	case 1: 	CORRECTION =  0; 	break;
	case 2: 	CORRECTION =  0; 	break;
	case 3: 	CORRECTION =  0; 	break;
	case 4: 	CORRECTION =  0.11; 	break;
	case 5: 	CORRECTION =  0.165; 	break;
	case 6: 	CORRECTION =  0.2; 	break;
	case 7: 	CORRECTION =  0.215; 	break;
	case 8: 	CORRECTION =  0.225; 	break;
	case 9: 	CORRECTION =  0.25; 	break;
	case 10: 	CORRECTION =  0.3; 	break;
	default:	CORRECTION =  0.33;	break;
}

//===================================================== 
// NICHT ÄNDERN !!!
// Globle Variablen für das Programm

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); 
var LOOPS = 0;
var TOUCH_LOOP = 0;
var LAST_SPAWN = -GEAR_SPAWN_INTERVAL * FPS;
var FONT_SIZE = 0.8 * canvas.width / REIHE_INFO.length;
if ( FONT_SIZE > FONT_MAX ) { FONT_SIZE = FONT_MAX; }
const GEAR_SIZE = GEAR_SCALE * 0.4 * ROBOT_W;
var interval;
const pi_loop = [0,0.106795,0.212370,0.315515,0.415052,0.50984,0.59879,0.68090,0.75522,0.82090,0.87720,0.92345,0.95915,0.98388,0.9973,0.99941,0.99004,0.96935,0.93757,0.8950,0.84233,0.77995,0.7086,0.62925,0.54265,0.449845,0.35189,0.249915,0.14507,0.05]
var looper = 0;
var keyOn = [];
var key = false;
var touch_x = -1;
var end;
var right_border;
var left_border;
var good_catch = false;
var RIGHT = 0;
var WRONG = 0;
var last_direction;
var MAX_GEAR = Math.floor((canvas.width / ROBOT_W) * MAX_GEAR_SCALE);

const left = new Image();
const right = new Image();
const gear = new Image();
const happy = new Image();
const glow = new Image();
const sad = new Image();
const shine = new Image();
const controlls = new Image();
const vault = new Image();
const england = new Image();

left.src =  "assets/left.png";
right.src = "assets/right.png";
gear.src =  "assets/gear.png";
happy.src = "assets/robot_happy.png";
glow.src =  "assets/robot_happy_glow.png";
sad.src =   "assets/robot_sad.png";
shine.src = "assets/shine.png";
controlls.src = "assets/controlls.png";
vault.src = "assets/vault.png";
england.src = "assets/england.png";


var robot;
var robot_img = left;
var BACKGROUND = BACKGROUND_COLOR; 
var GEAR_SPAWEND;
var GEAR_ON_SCREEN = 0;
var GEAR = [];
var CATCH_TIMER = 0;

var Gear = function() {
	const min = Math.ceil(1);
	const max = Math.floor(REIHE * 10);
	this.x = Math.floor(Math.random() * ((canvas.width) - GEAR_SIZE))
	this.y = -GEAR_SIZE;
	this.collision = false;
	this.collision_y = 0;
	this.num = Math.floor(Math.random() * (max - min ) + min);
	this.correct = (this.num % REIHE == 0);
	this.catchable = true;

	if(Math.random() < CORRECTION)
	{
		this.num = REIHE * Math.floor(Math.random() * (10 - min) + min);
		this.correct = true;
	}

	if(this.correct) { RIGHT++;} else { WRONG++;}

	this.font_x_shift = GEAR_SIZE * 0.22;
	this.font_y_shift = GEAR_SIZE * 0.65;
	if ( this.num < 10 )
	{
		this.font_x_shift = GEAR_SIZE * 0.36
	}

	this.update = function() {
		this.y += GRAVITY;
		if ( this.collision ) 
		{
			ctx.save()
			ctx.globalAlpha = 1 / (ALPHA_SPEED * ( this.y - this.collision_y));
		}
		if ( ! this.catchable ) { ctx.save(); ctx.globalAlpha = 0.5; }
		ctx.drawImage(gear, this.x,this.y, GEAR_SIZE, GEAR_SIZE);
		ctx.fillStyle = GEAR_FONT_COLOR;

		if ( this.num < 10 ) { ctx.font = GEAR_SIZE/1.7 + 'px sans'; }
		else if ( this.num < 100 ) { ctx.font = GEAR_SIZE/2.3 + 'px sans'; }
		else if ( this.num < 1000 ) { ctx.font = GEAR_SIZE/3.2 + 'px sans'; }
		else { ctx.font = GEAR_SIZE/4.6 + 'px sans'; }

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		ctx.fillText(this.num, this.x + GEAR_SIZE / 2 , this.y + GEAR_SIZE / 1.87);
		if ( this.collision || ! this.catchable )
			ctx.restore();
		if ( this.y  + GEAR_SIZE / 3 > canvas.height) {
			GEAR_ON_SCREEN--;
			GEAR.shift();
		}
	}
}

function restart() 
{
	clearInterval(interval);
	clearInterval(end);
	PUNKTE = 0;
	LOOPS = 0;
	TOUCH_LOOP = 0;
	LAST_SPAWN = -GEAR_SPAWN_INTERVAL * FPS;
	keyOn = [];
	touch_x = -1;
	robot = new Robot;
	RIGHT = 0;
	WRONG = 0;
	MAX_GEAR = Math.floor((canvas.width / ROBOT_W) * MAX_GEAR_SCALE);
	BACKGROUND = BACKGROUND_COLOR; 
	GEAR_SPAWEND;
	GEAR_ON_SCREEN = 0;
	GEAR = [];
	CATCH_TIMER = 0;
	Game.init();
}


function start() { 
	LOOPS = 50;
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	vault_left = canvas.width * 0.4;

	let timer = setInterval(function() {
  		if ( ! LOOPS ) { clearInterval(timer);  drop(); }
  		else  {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.fillStyle = BACKGROUND_COLOR;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(vault, vault_left + bounce(LOOPS/50) * canvas.width / 2 , canvas.height * 0.02, canvas.height / 2, canvas.height / 2);
			LOOPS--;
		}} , 1000/FPS);


}

function drop() {
	LOOPS = 0;
	let timer2 = setInterval(function() {
		if ( LOOPS === 50 ) { 
			clearInterval(timer2);
			LOOPS = 0;
			document.addEventListener('keydown', function(event) { key = true; }, false);
			canvas.addEventListener("touchstart",   function(event) { key = true; });
			float(); 
		}
		else {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.fillStyle = BACKGROUND_COLOR;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.drawImage(controlls, - controlls.width + LOOPS * canvas.width / 250 , canvas.height * 0.75, canvas.width * 1.03, canvas.width / 3);
			ctx.drawImage(england, vault_left * 1.2 , canvas.height / 3  + LOOPS * canvas.height / 115 , canvas.height / 2 * 17/100, canvas.height / 2 * 68/165 );
			ctx.drawImage(vault, vault_left , canvas.height * 0.02, canvas.height / 2, canvas.height / 2);
			LOOPS++;
		}} , 1000/FPS);
}

function float() {
	let timer3 = setInterval(function() {
		if ( key ) { 
			clearInterval(timer3);
			key = false;
			restart();
		}
		else {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.fillStyle = BACKGROUND_COLOR;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.drawImage(controlls, - controlls.width + 50 * canvas.width / 250 , canvas.height * 0.75, canvas.width * 1.03, canvas.width / 3);
			y = ((canvas.height * 53/69) + ((Math.sin(Date.now()*FLOATING_SPEED * 0.001)+1) / 2 * canvas.height * 0.05));
			ctx.drawImage(england, vault_left * 1.2 , y, canvas.height / 2 * 17/100, canvas.height / 2 * 68/165 );
			ctx.drawImage(vault, vault_left , canvas.height * 0.02, canvas.height / 2, canvas.height / 2);
			LOOPS++;
		}} , 1000/FPS);
}


function bounce(timeFraction) {
	for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
		if (timeFraction >= (7 - 4 * a) / 11) {
			return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2) } } }


//Start = new function()
//{
//	this.draw = function()
//	{
//	}
//
//	this.animControlls = function()
//	{
//		ctx.drawImage(controlls,0,0);
//	}
//
//	this.loop = function()
//	{
//		ctx.clearRect(0,0,canvas.width,canvas.height);
//		ctx.fillStyle = BACKGROUND_COLOR;
//		ctx.fillRect(0, 0, canvas.width, canvas.height);
//		ctx.fillStyle = '#000000';
//		ctx.fillRect(100,100,100,100);
//		//this.draw();
//
//	}
//
//
//	this.init = function()
//	{
//		ctx.canvas.width = window.innerWidth;
//		ctx.canvas.height = window.innerHeight;
//		interval = setInterval(this.loop, 1000/FPS);
//
//	}
//
//}

function endcard() 
{
	END_MESSAGE = "Du hast " + PUNKTE + " von " + RIGHT + " Punkten erreicht!";
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if ( PUNKTE / RIGHT  <= WINNING_PERCENTAGE )
	{
		y = ((canvas.height * 0.3 ) + ((Math.sin(Date.now()*FLOATING_SPEED * 0.001)+1) / 2 * canvas.height * ENDCARD_FLOATING_AMP_SAD));
		ctx.drawImage(sad, canvas.width / 2 - canvas.height * 0.2, y, canvas.height * 0.45, canvas.height * 0.6);
	}
	else
	{
		y = ((canvas.height * 0.3 ) + ((Math.sin(Date.now()*FLOATING_SPEED * 0.001)+1) / 2 * canvas.height * ENDCARD_FLOATING_AMP_HAPPY));
		ctx.drawImage(happy, canvas.width / 2 - canvas.height * 0.25, y, canvas.height * 0.5, canvas.height * 0.6);
		ctx.save()
		alpha = ((Math.sin(Date.now()*FLOATING_SPEED * 0.0016)+1) / 2);
		ctx.globalAlpha = alpha;
		ctx.drawImage(glow, canvas.width / 2 - canvas.height * 0.25, y, canvas.height * 0.5, canvas.height * 0.6);
		ctx.restore();
	}
	ctx.font = 1.2 * canvas.width / END_MESSAGE.length + 'px sans';
	ctx.fillStyle = FONT_COLOR;
	ctx.textAlign = "center";
	ctx.fillText(END_MESSAGE , canvas.width / 2 , canvas.height / 4);
	if ( key === 4 ) { restart(); }
}

var Robot = function() {

	this.width = ROBOT_W;
	this.height = ROBOT_H;

	this.x = canvas.width / 2;

	this.min_y = canvas.height - this.height;
	this.y = this.min_y;

	this.speed = ROBOT_SPEED;
	this.right = false;

this.update = function() {
	this.move();
	if ( good_catch ) { robot.shine(); }
	this.draw();
} 

this.move = function() {
	
	touch_right = ( canvas.width / 2 < touch_x );
	touch_left = ( 0 <= touch_x && touch_x <= canvas.width / 2);

	if (keyOn[37] || touch_left ) {
		this.right = false;
		if ( this.right === last_direction )
			{ this.x -= this.speed; }
		else {
			this.x += this.width * 0.44;
		}
	}
	if (keyOn[39] || touch_right )
	{
		this.right = true;
		if ( this.right === last_direction )
			{ this.x += this.speed; }
		else {
			this.x -= this.width * 0.44;
		}
	}
	// left boundary
	if (! this.right && this.x < 0) {this.x = 0;}
	// right boundary
	if (this.right && this.x + this.width > canvas.width) {this.x = canvas.width - this.width;}
	this.y = this.min_y - ((Math.sin(Date.now()*FLOATING_SPEED * 0.001)+1) / 2 * canvas.height * FLOATING_AMPLITUDE);

	last_direction = this.right;
}
	
	this.draw = function(){

		touch_right = ( canvas.width / 2 < touch_x );
		touch_left = ( 0 <= touch_x && touch_x <= canvas.width / 2);

		if (keyOn[37] || touch_left) {robot_img = left;}
		if (keyOn[39] || touch_right ) {robot_img = right;}

		ctx.drawImage(robot_img, this.x,this.y, this.width, this.height);
	}

	this.shine = function()
	{
		var shine_x;
		if ( this.right ) 
		{ shine_x = this.x + this.width * 171/400; } 
		else { shine_x = this.x + this.width * 5/400; }
		var shine_w = 224/400 * shine.width;
		var shine_h = shine_w / 2;
		var shine_y = this.y + this.height * 170/331 - shine_h; 
		ctx.globalAlpha = pi_loop[looper];
		looper++;
		if ( looper === 30 ) { good_catch = false; }
		ctx.drawImage(shine, shine_x, shine_y, shine_w, shine_h);
		ctx.globalAlpha = 1;
	}


}


Game = new function() {

	function newGear()
	{
		if (GEAR_ON_SCREEN != MAX_GEAR)
		{ 
			GEAR[GEAR.length] = new Gear;
			GEAR_ON_SCREEN++;
		}
	}

	function collision(gear)
	{
		if ( robot.right )
		{
			left_border = robot.x + ROBOT_W * 0.4;
			right_border = robot.x + ROBOT_W;
		}
		else
		{
			left_border = robot.x;
			right_border = robot.x + ROBOT_W * 0.6;
		}

		if (gear.y + GEAR_SIZE < robot.y + ROBOT_H * 0.45 || gear.collision )
			return;

		if (gear.y >= canvas.height - GEAR_SIZE / 2 && gear.catchable)
		{
			gear.catchable = false;
			if ( gear.correct )
			{
				CATCH_TIMER = 0;
				PUNKTE--;
				BACKGROUND = WRONG_COLOR;
			}
		}

		if (left_border < gear.x + GEAR_SIZE / 2  && gear.x + GEAR_SIZE / 2 < right_border && gear.catchable)
		{
			gear.collision = true;
			gear.collision_y = gear.y;
			CATCH_TIMER = 0;
			if ( gear.correct )
			{
				PUNKTE++;
				good_catch = true;
				looper = 0;
			}
			else {
				PUNKTE--;
				BACKGROUND = WRONG_COLOR;
			}
		}
	}

	this.loop = function() {

		if ( ctx.canvas.width != window.innerWidth || ctx.canvas.width != window.innerWidth)
		{
			FONT_SIZE = canvas.width / REIHE_INFO.length;
			if (FONT_SIZE > FONT_MAX) FONT_SIZE = FONT_MAX;
			ctx.canvas.width = window.innerWidth;
			ctx.canvas.height = window.innerHeight;
			robot.min_y = canvas.height - ROBOT_H;
			robot.y = robot.min_y;
		}

		ctx.clearRect(0,0,canvas.width,canvas.height)
		if ( CATCH_TIMER > FPS / 4 ) { 
			BACKGROUND = BACKGROUND_COLOR;
		}
		ctx.fillStyle = BACKGROUND;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		REMAINING_TIME = Math.ceil(GAME_DURATION - LOOPS/FPS);
		if ( LOOPS - LAST_SPAWN === GEAR_SPAWN_INTERVAL * FPS ) { newGear(); LAST_SPAWN = LOOPS; }

		for(let i = 0; i < GEAR.length; i++) { GEAR[i].update(); }
		for(let i = 0; i < GEAR.length; i++) { collision(GEAR[i]); }

		robot.update();

		ctx.fillStyle = FONT_COLOR;
		ctx.font = FONT_SIZE * FONT_SCALE + 'px sans';
		ctx.textAlign = 'end';
		ctx.fillText(PUNKTE, canvas.width - FONT_SIZE * 0.25 , FONT_SIZE * FONT_SCALE);
		ctx.textAlign = 'center';
		ctx.fillText(REMAINING_TIME, canvas.width / 2 , FONT_SIZE * FONT_SCALE); ctx.textAlign = 'start';
		ctx.font = FONT_SIZE + 'px sans';
		ctx.fillText("Vielfache von " + REIHE, FONT_SIZE / 4, FONT_SIZE * FONT_SCALE * 0.75);
		LOOPS++;
		CATCH_TIMER++;
		if ( REMAINING_TIME === 0 )
		{
			clearInterval(interval);
			for( let i = 0; i < GEAR.length; i++ ) 
			{
				if (GEAR[i].correct)
				{ 
					RIGHT--; 
				}
			}
			setTimeout(() => {
				document.addEventListener('keydown', function(event) { key = 4; }, false);
				canvas.addEventListener("touchstart",   function(event) { key = 4; });
			}, 2000);
			end = setInterval(endcard, 1000/FPS);

			return;
		}
	}

	this.run = function() { interval = setInterval(this.loop, 1000/FPS); }

	this.init = function()
	{
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	document.addEventListener('keydown', function(event) {keyOn[event.keyCode] = true; }, false);
	document.addEventListener('keyup', function(event) {keyOn[event.keyCode] = false; }, false);

	canvas.addEventListener("touchstart",   function(event) {touch_x = event.changedTouches[0].pageX; robot.update();});
    	canvas.addEventListener("touchmove",  function(event) {touch_x = event.changedTouches[0].pageX;});
    	canvas.addEventListener("touchend",  function(event) {touch_x = -1;});

	ctx.fillStyle = BACKGROUND;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	robot = new Robot;
	this.run();
	}
}
