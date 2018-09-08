//includes (lib/utils/addref.js must be added in the html)
//AddReference("render.js", "body");

function MainGame ()
{
	//handle to canvas object

	var c=document.getElementById("myCanvas");

	var cxt=c.getContext("2d");
	
	currentAssets = 0;
	totalAssets = 1;
	var skull = new Image();
	skull.onload = function()
	{
		currentAssets = currentAssets + 1;
		CheckAssets();
	}
	skull.src = "killdotimages/skull.png";

	function CheckAssets()
	{
		if (currentAssets == totalAssets)
			StartGame();
	}

	function StartGame()
	{
	}

	var backgroundvec =
	{
		type: "rectangle",
		fillstyle: "#00AA00",
		left: 0,
		top: 0,
		right: 500,
		bottom: 400
	}
	var background = []
	background.type = "vectorlist";
	background.x = 0;
	background.y = 0;
	background[0] = backgroundvec;
	
	var rectvec1 =
	{
		type: "rectangle",
		fillstyle: "#AA0000",
		left: 5,
		top: 0,
		right: 10,
		bottom: 25
	}
	var rectvec2 =
	{
		type: "rectangle",
		fillstyle: "#AA0000",
		left: 0,
		top: 40,
		right: 70,
		bottom: 10
	}
	var rectvec3 =
	{
		type: "rectangle",
		fillstyle: "#AA0000",
		left: 55,
		top: 0,
		right: 10,
		bottom: 25
	}
	var line1 =
	{
		type: "line",
		fillstyle: "#FF0000",
		left: 100,
		top: 20,
		right: 100,
		bottom: 120
	}

	var vectorlist = [];
	vectorlist.type = "vectorlist";
	vectorlist.x = 50;
	vectorlist.y = 100;
	vectorlist[0] = rectvec1;
	vectorlist[1] = rectvec2;
	vectorlist[2] = rectvec3;
	vectorlist[3] = line1;
	
	var imagething = 
	{
		type: "image",
		x: 40,
		y: 40,
		image: skull
	}
	
	//Set up game loop
	setInterval(mainLoop, 33);
	function mainLoop()
	{
				
		var SceneArray = []; 
		SceneArray[0] = background;
		SceneArray[1] = vectorlist;
		SceneArray[2] = imagething;
		
		RenderScene(cxt, SceneArray);
	}
}

MainGame();