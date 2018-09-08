function MainGame ()
{
	var playerturn = 0;
	var WinnerValue = 0;
	var griddata = [];
	
	//background scene
	var bgSceneName = "backgroundScene";
	CreateScene(bgSceneName, 0, 0, 0, true);
	var backgroundScene = GetScene(bgSceneName);
	backgroundScene.items.push(BACKGROUND);
	backgroundScene.items.push(MAPGRID);
	
	var entitySceneName = "entityScene";
	CreateScene(entitySceneName, 0, 0, 0, true);
	var entityScene = GetScene(entitySceneName);
	
	var hudSceneName = "hudScene";
	CreateScene(hudSceneName, 0, 0, 0, true);
	var hudScene = GetScene(hudSceneName);
	hudScene.items.push(RESETBUTTON);
	hudScene.items.push(TURNTEXT);
	hudScene.items.push(TURNIMAGE);

	function InitGame()
	{
		for(var y = 0; y < GRIDSIZE; y++)
		{
			griddata[y] = [];
			for(var x = 0; x < GRIDSIZE; x++)
			{
				griddata[y][x] = 0;
			}
		}
		
		//reset entities
		entityScene.items = [];
				
		//reset winner value
		WinnerValue = 0;
		
		//reset player's turn
		playerturn = 1;
		UpdatePlayerTurnText();
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
		for(var y = 0; y < GRIDSIZE - 1; y++)
		{			
			for(var x = 0; x < GRIDSIZE - 1; x++)
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

	function HidePlayerTurnText()
	{
		TURNIMAGE.vectoritems = [];
		TURNTEXT.content = "";
	}
	
	function UpdatePlayerTurnText()
	{
		if (playerturn == 1)
		{
			TURNIMAGE.vectoritems = [XSHAPE.Clone()];
		}
		else
		{
			TURNIMAGE.vectoritems = [CIRCLESHAPE.Clone()];
		}
		
		TURNTEXT.content = "Player Turn:";
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
		
		UpdatePlayerTurnText();
	}
	
	function GetGridChoiceX(xpos)
	{
		return Math.floor((xpos - MAPGRID.x) / LINESTEP);
	}
	function GetGridChoiceY(ypos)
	{
		return Math.floor((ypos - MAPGRID.y) / LINESTEP);
	}
	function IsPointInGrid(xpos, ypos)
	{
		if (xpos < MAPGRID.x)
			return false;
		if (xpos > MAPGRID.x + LINESTEP * GRIDSIZE)
			return false;
		if (ypos < MAPGRID.y)
			return false;
		if (ypos > MAPGRID.y + LINESTEP * GRIDSIZE)
			return false;
		
		return true;
	}
	
	function DisplayWinnerText()
	{
		if (WinnerValue != 0)
		{
			var entitySceneItem = new TextItem(50, 50, "36pt Arial", "#00FF00", "Winner! Player: " + WinnerValue);
			entityScene.items.push(entitySceneItem);
			
			HidePlayerTurnText();
		}
	}
	
	function onSquaresClick (e)
	{
		//don't check while not in play
		if (WinnerValue != 0)
			return;
			
		var xpos = e.offsetX;
		var ypos = e.offsetY;
		
		gridX = Math.floor((xpos - MAPGRID.x) / LINESTEP);
		gridY = Math.floor((ypos - MAPGRID.y) / LINESTEP);
		
		if (griddata[gridY][gridX] == 0)
		{
			griddata[gridY][gridX] = playerturn;
			PlacePieceInScene(gridX, gridY, playerturn);
			ChangeTurn();
			DisplayWinnerText();
		}		
	}
	InitializeInput(c);
	AddClickableItem(MAPGRID.x, MAPGRID.y, MAPGRID.x + LINESTEP * GRIDSIZE, MAPGRID.y + LINESTEP * GRIDSIZE, onSquaresClick, true);
	
	function OnResetButtonClick(e)
	{
		StartGame();
	}
	AddClickableItem(RESETBUTTON.x, RESETBUTTON.y, RESETBUTTON.x + 50, RESETBUTTON.y + 30, OnResetButtonClick, true);
		
	//Start game
	function StartGame()
	{
		InitGame();
	}
	
	function PlacePieceInScene(x, y, type)
	{
		var xPos = x * LINESTEP + MAPGRID.x + (LINESTEP / 2) - (PIECESIZE / 2);
		var yPos = y * LINESTEP + MAPGRID.y + (LINESTEP / 2) - (PIECESIZE / 2);

		if (type == 1)
		{
			var entitySceneItem = XSHAPE.Clone();
			entitySceneItem.x = xPos;
			entitySceneItem.y = yPos;
			entityScene.items.push(entitySceneItem);
		}
		else if (type == 2)
		{
			var entitySceneItem = new VectorListItem(xPos, yPos, [CIRCLESHAPE.Clone()]);			
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