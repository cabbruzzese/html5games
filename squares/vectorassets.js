//====================
//Set up vector art
//====================
//---------------------
//Background
var backgroundrec1 = new VectorItem("rectangle", "#FFFFFF", 0, 0, 500, 500);
var backgroundrec2 = new VectorItem("rectangle", "#555555", 10, 10, 480, 480);

var background = new VectorListItem(0, 0, [backgroundrec1, backgroundrec2]);
//---------------------



//---------------------
//Map Grid
var linestep = 35;
var gridsize = 10;

var mapGridItems = [];
for (var gridi = 0; gridi <= gridsize; gridi++)
{
	//horizontal lines
	var mapGridItem = new VectorItem("line", "#000000", 0, gridi * linestep, linestep * gridsize, gridi * linestep);
	mapGridItems.push(mapGridItem);
	
	//vertical lines
	mapGridItem = new VectorItem("line", "#000000", gridi * linestep, 0, gridi * linestep, linestep * gridsize);
	mapGridItems.push(mapGridItem);
}
var mapgrid = new VectorListItem((backgroundrec1.right / 2) - ((gridsize * linestep) / 2), 
								 (backgroundrec1.bottom / 2) - ((gridsize * linestep) / 2),
								 mapGridItems
	 );
//---------------------


//-----------
//x shape
var xline1 = new VectorItem("line", "#000000", 0, 0, 25, 25);
var xline2 = new VectorItem("line", "#000000", 25, 0, 0, 25);

var xshape = new VectorListItem(0, 0, [xline1, xline2]);
//-----------



var circle1 = new VectorItem("circle", "#FF0000", (linestep / 2) - (24 / 2), (linestep / 2) - (24 / 2), 12, 0);

//---------------------
//Button
var buttonoffset = 400;
var buttonrec1 = new VectorItem("rectangle", "#6666FF", 0, 0, 70, 30);
var buttonrec2 = new VectorItem("rectangle", "#2222FF", 1, 1, 68, 28);
var buttontext = new TextItem(10, 22, "14pt Arial", "#000000", "Reset");

var resetbutton = new VectorListItem(400, 450, [buttonrec1, buttonrec2, buttontext]);
//---------------------