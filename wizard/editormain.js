function MainGame ()
{
	//Create handle to canvas object
	var c=document.getElementById("myCanvas");
	var cxt=c.getContext("2d");

	InitializeInput(c);
	
	var BGScene;
	var HUDScene;
	
	var entities = [];
	var tiles = [];

	InitializeScenes();

	//turn on collision debugging
	PhysicsGlobals.IsDebug = false;
	
	function InitGame()
	{
	}
	
	function InitializeScenes()
	{
		if (CreateScene("background", 0, 0, 0, true))
		{
			BGScene = GetScene("background");
			var tempsceneobject = new SceneObject("backgroundobject", 0, 0, new VectorListItem(0, 0, ASSET_editorbackground));
			BGScene.items.push(tempsceneobject);
			
			var tempsceneobject = new SceneObject("panelobject", 0, 0, new VectorListItem(0, 0, ASSET_editorpanelbox));
			BGScene.items.push(tempsceneobject);
		}		
		if (CreateScene("hud", 0, 0, 0, false))
		{
			HUDScene = GetScene("hud");
			// var tempsceneobject;
			// ScoreLabel = new TextItem(0, 0, "18pt Arial", "#AA0000", "Score -");
			// tempsceneobject = new SceneObject("score", 15, 25, new VectorListItem(0, 0, [ScoreLabel]));
			// HUDScene.items.push(tempsceneobject);

			// TimeLabel = new TextItem(0, 0, "18pt Arial", "#AA0000", "Time (0:00)");
			// tempsceneobject = new SceneObject("time", 300, 25, new VectorListItem(0, 0, [TimeLabel]));
			// HUDScene.items.push(tempsceneobject);
		}
		//start the renderer (must pass in the context to initialize it)
		StartSceneRendererLoop(cxt, c);
	}
	
	//Start game
	function StartGame()
	{
		InitGame();
	}
	
	//Set up game loop
	setInterval(mainLoop, 33);
	function mainLoop()
	{
		ProcessKeys();		
	}	
		
	var KeysDown = [];
	document.onkeydown = function(event)
	{
		var key = event.keyCode;
		
		//if not already pressed
		if (ArrayFindIndexByItem(KeysDown, key) == -1)
		{
			//add to keydown array
			KeysDown.push(key);
			
			
			switch(key)
			{
				case Input.space:
					PlayerAttack();
					return;
				case Input.uparrow:
					Jump(playerjumpspeed * -1, "up"); 
					return;
			}
		}
	}
	document.onkeyup = function(event)
	{
		var key = event.keyCode;
		ArrayRemoveItem(KeysDown, key);		
	}
	
	var CameraXPos = 0;
	var CameraYPos = 0;
	var CameraXBounds = 1000;
	var CameraYBounds = 1000;
	function MoveCamera(upmove, rightmove)
	{
		var tempx =	CameraXPos + upmove;
		var tempy = CameraYPos + rightmove;
		
		if (tempx <= CameraXBounds && tempx >= (-1) * CameraXBounds)
			CameraXPos = tempx;
		if (tempy <= CameraYBounds && tempy >+ (-1) * CameraYBounds)
			CameraYPos = tempy;
			
		CameraYPos += rightmove;
		RenderGlobals.CameraX = CameraXPos;
		RenderGlobals.CameraY = CameraYPos;
	}
	
	function ProcessKeys()
	{
		for (var i = 0; i < KeysDown.length; i++)
		{
			var key = KeysDown[i];
			switch(key)
			{
				case Input.uparrow:
					MoveCamera(-1, 0);
					break;
				case Input.downarrow:
					MoveCamera(1, 0);
					break;
				case Input.rightarrow:
					MoveCamera(0, 1);
					break;
				case Input.leftarrow:
					MoveCamera(0, -1);
					break;
			}
		}
	}
	
	StartGame();
}

MainGame();
