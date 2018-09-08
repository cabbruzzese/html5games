//====================
//Set up vector art
//====================
//---- CONTEXT
//Create handle to canvas object
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
//----


//---- Background
var BGWIDTH = Math.min(c.width, c.height);
var BGHEIGHT = BGWIDTH;
var BGPADDING = 20;
var BACKGROUNDREC1 = new VectorItem("rectangle", "#FFFFFF", 0, 0, BGWIDTH, BGHEIGHT);
var BACKGROUNDREC2 = new VectorItem("rectangle", "#555555", 10, 10, BGWIDTH - BGPADDING, BGHEIGHT - BGPADDING);

var BACKGROUND = new VectorListItem(0, 0, [BACKGROUNDREC1, BACKGROUNDREC2]);
//----

//--- MAP GRID
var GRIDSIZE = 10;
var RENDERFIELD_WIDTH = BGWIDTH - BGPADDING * 2;
var PLAYINGFIELD_PERCENT = 0.80;
var PLAYINGFIELD_WIDTH = RENDERFIELD_WIDTH * PLAYINGFIELD_PERCENT;
var LINESTEP = PLAYINGFIELD_WIDTH / GRIDSIZE;

var MAPGRIDITEMS = [];
for (var gridi = 0; gridi <= GRIDSIZE; gridi++)
{
	//horizontal lines
	var mapGridItem = new VectorItem("line", "#000000", 0, gridi * LINESTEP, LINESTEP * GRIDSIZE, gridi * LINESTEP);
	MAPGRIDITEMS.push(mapGridItem);
	
	//vertical lines
	mapGridItem = new VectorItem("line", "#000000", gridi * LINESTEP, 0, gridi * LINESTEP, LINESTEP * GRIDSIZE);
	MAPGRIDITEMS.push(mapGridItem);
}
var MAPGRID = new VectorListItem((BACKGROUNDREC1.right / 2) - ((GRIDSIZE * LINESTEP) / 2), 
								 (BACKGROUNDREC1.bottom / 2) - ((GRIDSIZE * LINESTEP) / 2),
								 MAPGRIDITEMS
	 );
//----

var PIECESIZE_PERCENT = 0.80;
var PIECESIZE = LINESTEP * PIECESIZE_PERCENT;
//---- X
//x shape
var XLINE1 = new VectorItem("line", "#000000", 0, 0, PIECESIZE, PIECESIZE);
var XLINE2 = new VectorItem("line", "#000000", PIECESIZE, 0, 0, PIECESIZE);

var XSHAPE = new VectorListItem(0, 0, [XLINE1, XLINE2]);
//----

//---- O
var CIRCLESHAPE = new VectorItem("circle", "#FF0000", 0, 0, PIECESIZE / 2, 0);
//----

//---- RESET
var BUTTONOFFSET = 400;
var BUTTONREC1 = new VectorItem("rectangle", "#6666FF", 0, 0, 70, 30);
var BUTTONREC2 = new VectorItem("rectangle", "#2222FF", 1, 1, 68, 28);
var BUTTONTEXT = new TextItem(10, 22, "14pt Arial", "#000000", "Reset");

var RESETBUTTON = new VectorListItem(BGWIDTH - 100, BGHEIGHT - 50, [BUTTONREC1, BUTTONREC2, BUTTONTEXT]);
//----

//---- PLAYER TURN Text
var TURNTEXT_LEFT = BGPADDING + (BGWIDTH / 12);
var TURNTEXT_BOTTOM = BGHEIGHT - BGPADDING;
var TURNTEXT_BOXHEIGHT = 10;
var TURNTEXT = new TextItem(TURNTEXT_LEFT, TURNTEXT_BOTTOM - TURNTEXT_BOXHEIGHT, "20pt Arial", "#000000", "");
var TURNIMAGE = new VectorListItem(TURNTEXT_LEFT + 140 + PIECESIZE, TURNTEXT_BOTTOM - PIECESIZE - 5, []);