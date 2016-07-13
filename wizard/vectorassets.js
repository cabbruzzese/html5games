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
//Editor Background
var editorbackgroundrec1 = new VectorItem
(
	"rectangle",
	"#22FF30",	
	0,
	0,
	vectorassetc.width,
	vectorassetc.height
);
var ASSET_editorbackground = [editorbackgroundrec1];
//---------------------

//---------------------
//Editor HUD
var editorpanelrecwidth = 125;
var editorpanelborderwidth = 4;
var editorpanelrec1 = new VectorItem
(
	"rectangle",
	"#2230FF",	
	0,
	0,
	editorpanelrecwidth,
	vectorassetc.height
);
var editorpanelrec2 = new VectorItem
(
	"rectangle",
	"#000000",	
	0,
	0,
	editorpanelrecwidth,
	editorpanelborderwidth
);
var editorpanelrec3 = new VectorItem
(
	"rectangle",
	"#000000",	
	0,
	vectorassetc.height - editorpanelborderwidth,
	editorpanelrecwidth,
	vectorassetc.height
);
var editorpanelrec4 = new VectorItem
(
	"rectangle",
	"#000000",	
	editorpanelrecwidth - editorpanelborderwidth,
	0,
	editorpanelborderwidth,
	vectorassetc.height
);
var editorpanelrec5 = new VectorItem
(
	"rectangle",
	"#000000",	
	0,
	0,
	editorpanelborderwidth,
	vectorassetc.height
);
var ASSET_editorpanelbox = [editorpanelrec1, editorpanelrec2, editorpanelrec3, editorpanelrec4, editorpanelrec5];
//---------------------

var blockrec1 = new VectorItem
(
	"rectangle",
	"#333333",
	0,
	0,
	64,
	64
);
var ASSET_block = [blockrec1];

var fireballrec1 = new VectorItem
(
	"rectangle",
	"#AA0000",
	0,
	0,
	16,
	16
);
var ASSET_fireball = [fireballrec1];

var sparklerec1 = new VectorItem
(
	"rectangle",
	"#000000",
	0,
	0,
	32,
	48
);
var ASSET_sparkle = [sparklerec1];


//player images
var ASSET_body1image = new ImageItem(0,0, null, "assets/body1.png");
var ASSET_body2image = new ImageItem(0,0, null, "assets/body2.png");
var ASSET_body3image = new ImageItem(0,0, null, "assets/body3.png");
var ASSET_body4image = new ImageItem(0,0, null, "assets/body4.png");
var ASSET_animwalk = [ASSET_body1image, ASSET_body2image];
var ASSET_animattack = [ASSET_body1image, ASSET_body3image, ASSET_body4image];

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