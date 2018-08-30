function MainGame ()
{
	//Create handle to canvas object
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");

	var playerturn = 0;
	var WinnerValue = 0;
	var griddata = new Array();
	
	//background scene
	var bgSceneName = "backgroundScene";
	CreateScene(bgSceneName, 0, 0, 0, true);
	var backgroundScene = GetScene(bgSceneName);
	backgroundScene.items.push(background);
	backgroundScene.items.push(mapgrid);
	
	var entitySceneName = "entityScene";
	CreateScene(entitySceneName, 0, 0, 1, true);
	var entityScene = GetScene(entitySceneName);
	
	var hudSceneName = "hudScene";
	CreateScene(hudSceneName, 0, 0, 2, true);
	var hudScene = GetScene(hudSceneName);
	hudScene.items.push(resetbutton);

	function InitGame()
	{
		for(var y = 0; y < gridsize; y++)
		{
			griddata[y] = new Array()
			for(var x = 0; x < gridsize; x++)
			{
				griddata[y][x] = 0;
			}
		}
		
		//reset entities
		entityScene.items = [];
		
		//reset player's turn
		playerturn = 1;
		
		//reset winner value
		WinnerValue = 0;
	}
	
	//checks both players.
	// returns 0 for no win, returns 1 for p1 win, returns 2 for p2 win
	function CheckWin()
	{
		//check square based on current position. 
		//  .-----------------.
		//  | pos,   |  check |
		//  |-----------------|
		//  | check, |  check |
		//  '-----------------'
		// Never check last row or column
		for(var y = 0; y < gridsize - 1; y++)
		{			
			for(var x = 0; x < gridsize - 1; x++)
			{
				var playernum = griddata[y][x];				
				if (playernum != 0 &&
					griddata[y + 1][x] == playernum &&
					griddata[y][x + 1] == playernum &&
					griddata[y + 1][x + 1] == playernum)
				{
					return playernum;
				}
			}
		}
		
		return 0;
	}
	
	function ChangeTurn()
	{
		//before switching turns, check winner
		WinnerValue = CheckWin();
		if (WinnerValue != 0)
		{
			return;
		}
		
		playerturn++;
		if (playerturn > 2)
			playerturn = 1;
	}
	
	function GetGridChoiceX(xpos)
	{
		return Math.floor((xpos - mapgrid.x) / linestep);
	}
	function GetGridChoiceY(ypos)
	{
		return Math.floor((ypos - mapgrid.y) / linestep);
	}
	function IsPointInGrid(xpos, ypos)
	{
		if (xpos < mapgrid.x)
			return false;
		if (xpos > mapgrid.x + linestep * gridsize)
			return false;
		if (ypos < mapgrid.y)
			return false;
		if (ypos > mapgrid.y + linestep * gridsize)
			return false;
		
		return true;
	}
	function onSquaresClick (e)
	{
		//don't check while not in play
		if (WinnerValue != 0)
			return;
			
		var xpos = e.offsetX;
		var ypos = e.offsetY;
		
		gridX = Math.floor((xpos - mapgrid.x) / linestep);
		gridY = Math.floor((ypos - mapgrid.y) / linestep);
		
		if (griddata[gridY][gridX] == 0)
		{
			griddata[gridY][gridX] = playerturn;
			PlacePieceInScene(gridX, gridY, playerturn);
			ChangeTurn();
		}		
	}
	InitializeInput(c);
	AddClickableItem(mapgrid.x, mapgrid.y, mapgrid.x + linestep * gridsize, mapgrid.y + linestep * gridsize, onSquaresClick, true);
	
	function OnResetButtonClick(e)
	{
		StartGame();
	}
	AddClickableItem(resetbutton.x, resetbutton.y, resetbutton.x + 50, resetbutton.y + 30, OnResetButtonClick, true);
		
	//Start game
	function StartGame()
	{
		InitGame();
	}
	
	function PlacePieceInScene(x, y, type)
	{
		if (type == 1)
		{
			var xPos = x * linestep + mapgrid.x + (linestep / 2) - (25 / 2);
			var yPos = y * linestep + mapgrid.y + (linestep / 2) - (25 / 2);
			var entitySceneItem = new VectorListItem(xPos, yPos, [xline1. xline2]);
			entityScene.items.push(entitySceneItem);
		}
		
		else if (type == 2)
		{
			var xPos = x * linestep + mapgrid.x;
			var yPos = y * linestep + mapgrid.y;
			var entitySceneItem = new VectorListItem(xPos, yPos, [circle1]);
			
			entityScene.items.push(entitySceneItem);
		}
		
		//display winner text
		if (WinnerValue != 0)
		{
			var entitySceneItem = new TextItem(50, 50, "36pt Arial", "#00FF00", "Winner! Player: " + WinnerValue);
			entityScene.items.push(entitySceneItem);
		}
	}
	
	//Set up game loop
	setInterval(mainLoop, 33);	
	function mainLoop()
	{
	}
	
	//start Rendering Loop
	StartSceneRendererLoop(ctx, c);
	
	//static call to start the game, since no assets need to load
	StartGame();
}

MainGame();