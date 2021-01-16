const assets = {
	'Ameise'	: ['Ameise',	'assets/Ameise.PNG',	'assets/Ameise.mp3'],
	'Ampel'		: ['Ampel',	'assets/Ampel.PNG',	'assets/Ampel.mp3'],
	'Ananas'	: ['Ananas',	'assets/Ananas.PNG',	'assets/Ananas.mp3'],
	'Banane'	: ['Banane',	'assets/Banane.PNG',	'assets/Banane.mp3'],
	'Blume' 	: ['Blume',	'assets/Blume.PNG',	'assets/Blume.mp3'],	
	'Besen'		: ['Besen', 	'assets/Besen.PNG',	'assets/Besen.mp3'],
	'Blumentopf'	: ['Blumentopf','assets/Blumentopf.PNG','assets/Blumentopf.mp3'],
	'Brille'	: ['Brille',	'assets/Brille.PNG',	'assets/Brille.mp3'],
	'Chamaeleon' 	: ['Chamaeleon','assets/Chamaeleon.PNG','assets/Chamaeleon.mp3'],	
	'Delfin' 	: ['Delfin',	'assets/Delfin.PNG',	'assets/Delfin.mp3'],	
	'Dose'		: ['Dose',	'assets/Dose.PNG',	'assets/Dose.mp3'],
	'Eis'		: ['Eis',	'assets/Eis.PNG',	'assets/Eis.mp3'],
	'Eimer'		: ['Eimer',	'assets/Eimer.PNG',	'assets/Eimer.mp3'],
	'Ente'		: ['Ente',	'assets/Ente.PNG',	'assets/Ente.mp3'],
	'Esel' 		: ['Esel',	'assets/Esel.PNG',	'assets/Esel.mp3'],	
	'Feder'		: ['Feder',	'assets/Feder.PNG',	'assets/Feder.mp3'],
	'Floete'	: ['Floete',	'assets/Floete.PNG',    'assets/Floete.mp3'],
	'Floete' 	: ['Flöte',	'assets/Floete.PNG',	'assets/Floete.mp3'],	
	'Gabel' 	: ['Gabel', 	'assets/Gabel.PNG',	'assets/Gabel.mp3'],	
	'Lampe' 	: ['Lampe',	'assets/Lampe.PNG',	'assets/Lampe.mp3'],	
	'Lineal' 	: ['Lineal',	'assets/Lineal.PNG',	'assets/Lineal.mp3'],	
	'Loewe' 	: ['Löwe',	'assets/Loewe.PNG',	'assets/Loewe.mp3'],	
	'Luftballon'	: ['Luftballon','assets/Luftballon.PNG','assets/Luftballon.mp3'],
	'Luftballon' 	: ['Luftballon','assets/Luftballon.PNG','assets/Luftballon.mp3'],	
	'Lupe'		: ['Lupe',	'assets/Lupe.PNG',      'assets/Lupe.mp3'],
	'Lupe' 		: ['Lupe',	'assets/Lupe.PNG',	'assets/Lupe.mp3'],	
	'Mais'		: ['Mais',	'assets/Mais.PNG',	'assets/Mais.mp3'],
	'Maus'		: ['Maus',	'assets/Maus.PNG',	'assets/Maus.mp3'],
	'Mond'		: ['Mond',	'assets/Mond.PNG',	'assets/Mond.mp3'],
	'Muffin'	: ['Muffin',	'assets/Muffin.PNG',	'assets/Muffin.mp3'],
	'Nadel' 	: ['Nadel',	'assets/Nadel.PNG',	'assets/Nadel.mp3'],	
	'Oma'		: ['Oma',	'assets/Oma.PNG',	'assets/Oma.mp3'],
	'Saege'		: ['Saege',	'assets/Saege.PNG',	'assets/Saege.mp3'],	
	'Sechs'		: ['Sechs',	'assets/Sechs.PNG',     'assets/Sechs.mp3'],
	'Sieben'	: ['Sieben',	'assets/Sieben.PNG',    'assets/Sieben.mp3'],
	'Sofa'		: ['Sofa',	'assets/Sofa.PNG',    'assets/Sofa.mp3'],
	'Stempel'	: ['Stempel',	'assets/Stempel.PNG',	'assets/Stempel.mp3'],
	'Wolke'		: ['Wolke',	'assets/Wolke.PNG',	'assets/Wolke.mp3'],
}

function getWords(letter) {
	switch(letter) {
		case "m" :
			words = ['Ameise','Ampel','Banane','Blumentopf','Brille','Dose','Eimer','Ente','Feder','Mais','Maus','Mond','Muffin','Oma','Stempel','Wolke'];
			break;
		case "l" :
			words = ['Ameise','Ampel','Banane','Blume','Brille','Chamaeleon','Delfin','Dose','Esel','Feder','Floete','Gabel','Lampe','Lineal','Loewe','Luftballon','Lupe','Maus','Nadel','Wolke'];
			break;	
		case "s" :
			words = ['Ameise','Ananas','Besen','Brille','Chamaeleon','Dose','Eis','Esel','Feder','Floete','Gabel','Lampe','Lineal','Maus','Nadel','Saege','Sechs','Sieben','Sofa','Sonne'];
			break;  
	}
	return words;
}
