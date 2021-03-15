---
title: Online Spiele
author: Jonas Walkling
lang: de
disable-header-and-footer: true
header-includes:
 - \usepackage[T1]{fontenc}
 - \usepackage{tikz}
 - \usepackage{multicol}
 - \usepackage{hyperref}
 - \usepackage{svg}
 - \setcounter{secnumdepth}{3}
 - \setcounter{tocdepth}{1}
 - \renewcommand{\contentsname}{Spiele}
---


\maketitle
\tableofcontents

\section*{URL-Parameter}

\begin{multicols}{2}


Ein URL Parameter gibt Informationen an die aufgerufene Internetseite weiter. Sie stehen nach der Adresse -- eingeleitet durch ein ?.
Ein Wert wird dann mit dem Namen des Wertes (Key), einem '=' und der zugehörigen Zahl, nach dem Muster key=zahl angegeben. Die Spiele sind so konzipiert, dass alle Werte einen Standard besitzen (als Default angegeben). Wenn kein Wert über die URL eingegeben wird, verwendet das Programm den Defaultwert.
Die Range ist ein Angabe in Welchem der Wert liegen muss bzw. in welchem Bereich, das Spiel immer noch Spielbar ist. Bei $\in \mathbb{N}$ muss es eine Ganzzahl sein, bei $\in \mathbb{Q}$ kann es eine Kommazahl sein. Falls Wörter (strings) oder bestimmte Zahlen verlanget werden ist dies in den Docs der einzelnen Spiele angegeben.

\end{multicols}

# Einmaleins

#### reihe

Einmaleins Reihe. Das Spiel kann auch größere Reihen als 1-10. Zahlen bis zu vier Stellen werden korrekt angezeigt.

* Default: 7
* Range: 1-999 $\in \mathbb{N}$

#### dauer

Spieldauer in Sekunden

* Default: 45
* Range: 0 - $\infty \in \mathbb{N}$

#### prozent

Anteil der Zahnräder die von allen richtigen Zahnrädern gefangen werden müssen damit man das Spiel gewinnt.

* Default: 0.75
* Range: 0 - 1 $\in \mathbb{Q}$

#### speed

Laufgeschwindigkeit des Roboters

* Default: 30
* Range: 1 - $\infty \in \mathbb{N}$

#### schwerkraft

Fallgeschwindigkeit der Zahnräder

* Default: 3
* Range: 1 - 9 $\in \mathbb{N}$

#### interval

Zeitspanne zwischen dem Erscheinen neuer Zahnräder

* Default: 2
* Range: 0.1 - $\infty \in \mathbb{Q}$

#### max

Faktor für die maximale Anzahl an Zahnrädern, die gleichzeitig auf dem Bildschirm zu sehen sind. max ist ein Multiplikator für die aus dem Quotient der Breite des Browserfensters und der Breite des Roboters berechneten Maximalanzahl. Wenn dieser Wert eher hoch ist ( > 5 ) ist für die Anzahl an Zahnrädern das Interval zwischen dem Erscheinen neuer Zahnräder ausschlaggebend.

* Default: 2
* Range: 0.1 - $\infty \in \mathbb{Q}$



#### fps
Spielgeschwindigkeit \
	Gibt an wie oft das Bild pro Sekunde neu berechnet wird. Ein größerer Wert bedeutet eine schnellere Lauf- und Fallgeschwindigkeit.

* Default: 30
* Range: 10 - 120 $\in \mathbb{N}$


#### breite

Breite des Roboters in Pixeln

* Default: 200
* Range: 75 - 400 $\in \mathbb{N}$

#### zr\_scale

Skalierung der Zahnradgröße im Verhältnis zum Roboter. Bei einem Wert von 1 hat das Zahnrad die 0.4-fache Breite des Roboters.

* Default: 1
* 0.5 - 3 $\in \mathbb{Q}$

 


# Anlaute

#### l

Legt das Level fest\

* Default: 4
* Möglich: 1 - 4 $\in \mathbb{N}$
  + Level 1: A, E, I, O, U, M, L, S
  + Level 2: Level 1 + W, R, F, N, T, Au, Ei
  + Level 3: Level 2 + H, D, Sch, K, Z, P, G, J, EU
  + Level 4: alle Anlaute
 

#### c

Legt fest wie sehr sich die Karten am Anfang abstoßen.

* Default: 2
* Möglich: 1 - 4 $\in \mathbb{Q}$
\item[]
\item[]
\item[]



# Mengen


#### set

Legt die verwendeten Bilder fest

* Default: augen
* Möglich: augen, finger, punkte, striche


#### t

Anzeigezeit in Millisekunden

* Default: 7
* Range: 100 - 1500 $\in \mathbb{N}$


#### s

Verkürzung der Anzeigezeit pro Runde in Prozent. Zum Beispiel wird für s=2 die Anzeigezeit pro runde um 2\% verringert.

* Default: 0
* Range: 1 - 10 $\in \mathbb{N}$


#### r

Runden pro Durchgang

* Default: 20
* Range: 5 - 30 $\in \mathbb{N}$


#### c

Wenn c gesetzt wird werden keine Hintergrundfarben für die Buttons angezeigt.

* Default: An
* Range: egal (ASCII-Zeichen)


#### p

Wenn p gesetzt wird, wird das Endergebnis in Prozent, statt als x von y angezeigt.

* Default: x von y
* Range: egal (ASCII-Zeichen)



# Inlaute


#### Beispiel:

[laagbergschule.de/lernspiele/deutsch/inlaute?s=m&n=8](laagbergschule.de/lernspiele/deutsch/inlaute?s=m&n=8)

#### s

Legt den Buchstaben fest

* Default: -
* Möglich: l, m, s
	\bigskip


#### n

Legt die Anzal der Karten fest. Wenn die Anzahl der Karten kleiner ist, als die verfügbaren Wörter, werden n zufällige Wörter ausgewählt.

* Default: 10
* Möglich: 3 - Anzahl der Karten für einen Buchstaben $\in \mathbb{N}$
*


# Immerzehn

[laagbergschule.de/lernspiele/mathe/immerzehn?d=4&t=40](https://www.laagbergschule.de/lernspiele/mathe/immerzehn?d=4&t=40)

#### d

Legt die größe des Spielfeldes fest, z.B. d=4 gibt ein 4x4 Feld. Der Wert muss gerade sein, da das Spiel sonst nicht aufgehen kann.

* Default: 4 x 6
* Möglich: 2,4,6,8,10 $\in \mathbb{N}$


#### c

Legt die Anzahl der Spalten fest. Muss mit den Reihen multipliziert eine gerade Zahl ergeben.

* Default: 4
* Möglich: 2 - 10 $\in \mathbb{N}$


#### r

Legt die Anzahl der Reihen fest. Muss mit den Spalten multiplizert eine gerade Zahl ergeben.

* Default: 6
* Möglich: 2 - 10 $\in \mathbb{N}$


#### t

Legt die zeit pro Runde fest.

* Default: 60
* Möglich: 20-120 $\in \mathbb{N}$


#### g

Legt die Zahl fest, die das Ergenis sein soll.

* Default: 10
* Möglich: 2-16 $\in \mathbb{N}$
