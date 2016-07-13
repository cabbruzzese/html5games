var vectorassetc=document.getElementById("myCanvas");

//====================
//Set up vector art
//====================
//---------------------
//Background
var backgroundrec1 = new VectorItem
(
	"rectangle",
	"#22FF30",
	0,
	0,
	vectorassetc.width,
	vectorassetc.height
);
var ASSET_background = [backgroundrec1];
//---------------------


//-------------------
//tree shape
var treerect1_1 = new VectorItem
(
	"rectangle",
	"#00CC00",
	0,
	0,
	35,
	25
);
var treerect2_1 = new VectorItem
(
	"rectangle",
	"#884411",
	10,
	25,
	15,
	50
);
var ASSET_tree1 = [treerect1_1, treerect2_1];
//-------------------
//tree shape
var treerect1_2 = new VectorItem
(
	"rectangle",
	"#0000CC",
	0,
	0,
	50,
	50
);
var ASSET_tree2 = [treerect1_2];
//-------------------
//tree shape
var treerect1_3 = new VectorItem
(
	"rectangle",
	"#CC0000",
	0,
	0,
	50,
	50
);
var ASSET_tree3 = [treerect1_3];

var ASSET_animtreearray = [new VectorListItem(0, 0, ASSET_tree2), new VectorListItem(0, 0, ASSET_tree3)];

var ASSET_dinobodyimage = new ImageItem(0,0, null, "assets/triceratops.png");
var ASSET_raptorimage = new ImageItem(0,0, null, "assets/raptor.png");

//---------------------
//GameOver
var gameovertext = new TextItem 
(
	200, 
	255, 
	"48pt Arial", 
	"#222222", 
	"Game Over"
);
var gameoverscoretext = new TextItem 
(
	105, 
	325, 
	"48pt Arial", 
	"#222222", 
	""
);

//---------------------
//Replay Button
var replaybuttonrec1 = new VectorItem
(
	"rectangle",
	"#6666FF",
	0,
	0,
	77,
	30
);
var replaybuttonrec2 = new VectorItem
(
	"rectangle",
	"#2222FF",
	1,
	1,
	75,
	28
);
var replaybuttontext = new TextItem
(
	10, 
	22, 
	"14pt Arial", 
	"#000000", 
	"Replay"
);
//---------------------

var ASSET_GameOver = [gameovertext, gameoverscoretext];
//---------------------