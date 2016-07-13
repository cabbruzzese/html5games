function MainGame ()
{
	//Create handle to canvas object
	var c=document.getElementById("myCanvas");
	var cxt=c.getContext("2d");

	var playerturn = 0;
	var WinnerValue = 0;
	var griddata = new Array();
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
		
		//if (IsPointInGrid(xpos, ypos))
		//{
			gridX = Math.floor((xpos - mapgrid.x) / linestep);
			gridY = Math.floor((ypos - mapgrid.y) / linestep);
			
			if (griddata[gridY][gridX] == 0)
			{
				griddata[gridY][gridX] = playerturn;
				ChangeTurn();
			}
		//}
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
	
	//Set up game loop
	setInterval(mainLoop, 33);
	function mainLoop()
	{
		//background scene
		var backgroundscene = new Array(); 
		backgroundscene[0] = background;
		backgroundscene[1] = mapgrid;		
		RenderScene(cxt, backgroundscene);
		
		//fill entities in grid
		var entityscene = new Array();
		trailer = 0;
		for(var y = 0; y < gridsize; y++)
		{
			for(var x = 0; x < gridsize; x++)
			{
				if (griddata[y][x] == 1)
				{
					entityscene[trailer] = new Array();
					entityscene[trailer].type = "vectorlist";
					entityscene[trailer].x = x * linestep + mapgrid.x + (linestep / 2) - (25 / 2);
					entityscene[trailer].y = y * linestep + mapgrid.y + (linestep / 2) - (25 / 2);
					entityscene[trailer][0] = xline1;
					entityscene[trailer][1] = xline2;
					trailer++;
				}
				
				else if (griddata[y][x] == 2)
				{
					entityscene[trailer] = new Array();
					entityscene[trailer].type = "vectorlist";
					entityscene[trailer].x = x * linestep + mapgrid.x;
					entityscene[trailer].y = y * linestep + mapgrid.y;
					entityscene[trailer][0] = circle1;
					trailer++;
				}
			}
		}
		
		entityscene[trailer] = resetbutton;
		trailer++;
				
		//display winner text
		if (WinnerValue != 0)
		{		
			entityscene[trailer] = new Object();
			entityscene[trailer].type = "text";
			entityscene[trailer].x = 50;
			entityscene[trailer].y = 50;
			entityscene[trailer].fillstyle = "#00FF00";
			entityscene[trailer].font = "36pt Arial";
			entityscene[trailer].content = "Winner! Player: " + WinnerValue;
			trailer++;
		}
		RenderScene(cxt, entityscene);
	}
	
	//static call to start the game, since no assets need to load
	StartGame();
}

MainGame();