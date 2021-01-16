const shapes = [
		{
			shape  : "circle",
			coords : "10,10,4",
			href   : "assets"
		},
		{
			shape  : "circle",
			coords : "30,15,4",
			href   : "2"
		},
		{
			shape  : "circle",
			coords : "40,10,4",
			href   : "3"
		},
		{
			shape  : "rect",
			coords : "80,50,100,100",
			href   : "4"
		}
]

var map = document.getElementById("map");
var img = document.getElementById("karte");
window.addEventListener("resize", makeButtons);

function addArea(shape, coords, href)
{
	let area = document.createElement('area');
	area.setAttribute('href', href);
	area.setAttribute('shape', shape);
	area.setAttribute('coords', coords);
	map.appendChild(area);
}

function calcCoords() {
	w = img.width;
	h = img.height;
	for(i in shapes) {
		c = shapes[i].coords.split(',');
		for(let j = 0; j < c.length - 1; j += 2) {
			c[j]   = Math.round(c[0]*0.01 * w);
			c[j+1] = Math.round(c[1]*0.01 * h);
		}
		shapes[i].abscoords = c.toString();
	}
}

function makeButtons() {
	map.replaceChildren();
	calcCoords();
	shapes.forEach(function(shape) {
		addArea(shape.shape, shape.abscoords, shape.href);
	});
}
