const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.font = '50px Arial';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';
ctx.lineWidth = 10;

cards = [];

center = new Blackhole();
center.x = canvas.width / 2;
center.y = canvas.height / 2;

for(let i = 0; i < 10; i++) {
	cards.push(new Card(i, 100, 100))
	cards[i].velocity = cards[i].satelliteVelocity(center);
	cards[i].color = randPred();
	cards[i].group = cards[i].color;
}

function draw() {
	ctx.fillStyle = '#ddd';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	cards.forEach(function(card) { card.draw(); });
}

cards.push(center);

Move.prepare();
//mover = setInterval(Physics.move, 20, particles);
drawer = setInterval(draw, 20)

