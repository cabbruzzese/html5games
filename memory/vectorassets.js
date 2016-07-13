//====================
//Set up vector art
//====================
//---------------------
//Background
var backgroundrec1 = new VectorItem
(
	"rectangle",
	"#FFFFFF",
	0,
	0,
	500,
	500
);
var backgroundrec2 = new VectorItem
(
	"rectangle",
	"#555555",
	10,
	10,
	480,
	480
);
var ASSET_background = [backgroundrec1, backgroundrec2];
//---------------------



//---------------------
//Map Grid
var linestep = 35;
var gridsize = 10;

//---------------------

//-----------
//CardBack shape
var cardrect1 = new VectorItem
(
	"rectangle",
	"#000000",
	0,
	0,
	70,
	115
);
var cardrect2 = new VectorItem
(
	"rectangle",
	"#EE1111",
	10,
	10,
	50,
	95
);
var ASSET_cardback = [cardrect1, cardrect2];
//-----------

//-----------
//CardFront shape
var cardrectF1 = new VectorItem
(
	"rectangle",
	"#FFFFFF",
	0,
	0,
	70,
	115
);
var cardrectF2 = new VectorItem
(
	"rectangle",
	"#1111FF",
	10,
	10,
	50,
	95
);
var ASSET_cardfront = [cardrectF1, cardrectF2];
//-----------

//-----------
//CardWin shape
var cardrectWIN1 = new VectorItem
(
	"rectangle",
	"#00FF00",
	-5,
	-5,
	80,
	125
);
var ASSET_cardwin = [cardrectWIN1];
//-----------

//---------------------
//Button
var buttonoffset = 400;
var buttonrec1 = new VectorItem
(
	"rectangle",
	"#6666FF",
	0,
	0,
	70,
	30
);
var buttonrec2 = new VectorItem
(
	"rectangle",
	"#2222FF",
	1,
	1,
	68,
	28
);
var buttontext = new VectorItem
(
	"text",
	10,
	22,
	"14pt Arial",
	"#000000",
	"Reset"
);
var ASSET_resetbutton = [buttonrec1, buttonrec2, buttontext];
//---------------------

//---------------------
//GameOver
var gameovertext = new TextItem 
(
	105, 
	255, 
	"48pt Arial", 
	"#DDDDDD", 
	"You Win!"
);
var ASSET_GameOver = [gameovertext];
//---------------------