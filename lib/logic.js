const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

particles = [];

for(let i = 0; i < 0; i++) {
	particles.push(new Particle(i));
}

center = new Particle('center');
center.w = 233;
center.h = 233;
center.x = canvas.width/2 - center.w/2;
center.y = canvas.height/2 - center.h/2;
center.velocity = {x:0, y:0};
center.mass = 4000;

s1 = new Satellite(center);
//s2 = new Satellite(center);
//s3 = new Satellite(center);
//s4 = new Satellite(center);
//particles.unshift(center);


function move(particles) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for( let i = 0; i < particles.length; i++) {
		particles[i].forces(particles);
		particles[i].move();
		particles[i].draw();
		particles[i].debug();
	}
}

//mover = setInterval(move, 10, particles);
//mover = setInterval(move, 4, [s1,s2,s3,s4,center]);
mover = setInterval(move, 4, [s1,center]);

ctx.font = '50px Arial';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';
ctx.lineWidth = 10;

