//====================
//Set up vector art
//====================
//---------------------
//Background
var backgroundrec1 =
{
	type: "rectangle",
	fillstyle: "#FFFFFF",
	left: 0,
	top: 0,
	right: 500,
	bottom: 500
}
var backgroundrec2 =
{
	type: "rectangle",
	fillstyle: "#555555",
	left: 10,
	top: 10,
	right: 480,
	bottom: 480
}
var background = new Array();
background.type = "vectorlist";
background.x = 0;
background.y = 0;
background[0] = backgroundrec1;
background[1] = backgroundrec2;
//---------------------



//---------------------
//Map Grid
var linestep = 35;
var gridsize = 10;

var mapgrid = new Array(gridsize * 2);
mapgrid.type = "vectorlist";
mapgrid.x = (backgroundrec1.right / 2) - ((gridsize * linestep) / 2);
mapgrid.y = (backgroundrec1.bottom / 2) - ((gridsize * linestep) / 2);

function CreateMapGrid()
{
	var gridtrailer = 0;
	for (var gridi = 0; gridi <= gridsize; gridi++)
	{
		//horizontal lines
		mapgrid[gridtrailer] = new Object();
		mapgrid[gridtrailer].type = "line";
		mapgrid[gridtrailer].fillstyle = "#000000";
		mapgrid[gridtrailer].left = 0;
		mapgrid[gridtrailer].top = gridi * linestep;
		mapgrid[gridtrailer].right = linestep * gridsize;
		mapgrid[gridtrailer].bottom = gridi * linestep;
		gridtrailer++;
		
		//vertical lines
		mapgrid[gridtrailer] = new Object();
		mapgrid[gridtrailer].type = "line";
		mapgrid[gridtrailer].fillstyle = "#000000";
		mapgrid[gridtrailer].left = gridi * linestep;
		mapgrid[gridtrailer].top = 0;
		mapgrid[gridtrailer].right = gridi * linestep;
		mapgrid[gridtrailer].bottom = linestep * gridsize;
		gridtrailer++;
	}
}
CreateMapGrid();
//---------------------


//-----------
//x shape
var xline1 =
{
	type: "line",
	fillstyle: "#000000",
	left: 0,
	top: 0,
	right: 25,
	bottom: 25
}
var xline2 =
{
	type: "line",
	fillstyle: "#000000",
	left: 25,
	top: 0,
	right: 0,
	bottom: 25
}

var xshape = new Array();
xshape.type = "vectorlist";
xshape.x = 0;
xshape.y = 0;
xshape[0] = xline1;
xshape[1] = xline2;
//-----------



var circle1 =
{
	type: "circle",
	fillstyle: "#FF0000",
	left: (linestep / 2) - (24 / 2),
	top: (linestep / 2) - (24 / 2),
	right: 12,
	bottom: 0
}


//---------------------
//Button
var buttonoffset = 400;
var buttonrec1 =
{
	type: "rectangle",
	fillstyle: "#6666FF",
	left: 0,
	top: 0,
	right: 70,
	bottom: 30
}
var buttonrec2 =
{
	type: "rectangle",
	fillstyle: "#2222FF",
	left: 1,
	top: 1,
	right: 68,
	bottom: 28
}
var buttontext =
{
	type: "text",
	x: 10,
	y: 22,
	fillstyle: "#000000",
	font: "14pt Arial",
	content: "Reset"
}
var resetbutton = new Array();
resetbutton.type = "vectorlist";
resetbutton.x = 400;
resetbutton.y = 450;
resetbutton[0] = buttonrec1;
resetbutton[1] = buttonrec2;
resetbutton[2] = buttontext;
//---------------------