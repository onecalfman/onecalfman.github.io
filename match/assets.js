const assets = {
	'Ameise'	: ['Ameise',	'assets/Ameise.PNG',	'assets/Ameise.mp3'],
	'Ampel'		: ['Ampel',	'assets/Ampel.PNG',	'assets/Ampel.mp3'],
	'Banane'	: ['Banane',	'assets/Banane.PNG',	'assets/Banane.mp3'],
	'Blumentopf'	: ['Blumentopf','assets/Blumentopf.PNG','assets/Blumentopf.mp3'],
	'Brille'	: ['Brille',	'assets/Brille.PNG',	'assets/Brille.mp3'],
	'Dose'		: ['Dose',	'assets/Dose.PNG',	'assets/Dose.mp3'],
	'Eimer'		: ['Eimer',	'assets/Eimer.PNG',	'assets/Eimer.mp3'],
	'Ente'		: ['Ente',	'assets/Ente.PNG',	'assets/Ente.mp3'],
	'Feder'		: ['Feder',	'assets/Feder.PNG',	'assets/Feder.mp3'],
	'Mais'		: ['Mais',	'assets/Mais.PNG',	'assets/Mais.mp3'],
	'Maus'		: ['Maus',	'assets/Maus.PNG',	'assets/Maus.mp3'],
	'Mond'		: ['Mond',	'assets/Mond.PNG',	'assets/Mond.mp3'],
	'Muffin'	: ['Muffin',	'assets/Muffin.PNG',	'assets/Muffin.mp3'],
	'Oma'		: ['Oma',	'assets/Oma.PNG',	'assets/Oma.mp3'],
	'Stempel'	: ['Stempel',	'assets/Stempel.PNG',	'assets/Stempel.mp3'],
	'Wolke'		: ['Wolke',	'assets/Wolke.PNG',	'assets/Wolke.mp3']
}

function getWords(letter) {
	switch(letter) {
		case "m" :
			words = ['Ameise','Ampel','Banane','Blumentopf','Brille','Dose','Eimer','Ente','Feder','Mais','Maus','Mond','Muffin','Oma','Stempel','Wolke'];
			break;
	}
	return words;
}
