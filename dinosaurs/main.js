function MainGame ()
{
	var runnormaly = 300;
	var chargedistance = 100;
	var chargestopframe = 8;
	var dinomaxspeed = 9;
	var dinospeedmod = 0.2;
	var treespawndistance = 0;
	var treespawnlimit = 200;
	var maxforwardspeed = 5;
	var targetforwardspeed = 5;
	var actualforwardspeed = 0;
	var forwardspeedmod = 0.1;
	var forwardspeedsnap = 0.1;
	var RESETFORWARDSPEED_TIMEOUT = 300;
	var raptorspeed = 5;
	var TOTALTIME = 120000;//120seconds * 1000milliseconds
	var TimeLeft = -1;
	var TimerActive = false;
	
	//Create handle to canvas object
	var c=document.getElementById("myCanvas");
	var cxt=c.getContext("2d");

	InitializeInput(c);
	InitializeScenes();

	//turn on collision debugging
	PhysicsGlobals.IsDebug = false;
	
	function InitGame()
	{
		SetScore(0);
		TimeLeft = -1;
		TimerActive = false;
	}
		
	var BGScene;
	var GameScene;
	var GameOverScene;
	var HUDScene;
	
	var DinoSceneObject;
	var ScoreLabel;
	var TimeLabel;
	var ReplayButton;
	var scorevalue = 0;
	
	function InitializeScenes()
	{
		if (CreateScene("background", 0, 0, 0, true))
		{
			BGScene = GetScene("background");
			var backgroundobject = new SceneObject("backgroundobject", 0, 0, new VectorListItem(0, 0, ASSET_background));
			ArrayAddItem(BGScene.items, backgroundobject);
			
			AddClickableSceneObject(BGScene, backgroundobject, onBackgroundClick, false, null);
		}
		if (CreateScene("gamescreen", 0, 0, 0, false))
		{
			GameScene = GetScene("gamescreen");
			var tempsceneobject;
			tempsceneobject = new SceneObject("dino", 300, 300, ASSET_dinobodyimage);
			ArrayAddItem(GameScene.items, tempsceneobject);
			tempsceneobject.collision = new CollisionObject( 15, 20, 110, 75, onDinoCollided);
			DinoSceneObject = tempsceneobject;
		}
		if (CreateScene("hud", 0, 0, 0, false))
		{
			HUDScene = GetScene("hud");
			var tempsceneobject;
			ScoreLabel = new TextItem(0, 0, "18pt Arial", "#AA0000", "Score -");
			tempsceneobject = new SceneObject("score", 15, 25, new VectorListItem(0, 0, [ScoreLabel]));
			ArrayAddItem(HUDScene.items, tempsceneobject);

			TimeLabel = new TextItem(0, 0, "18pt Arial", "#AA0000", "Time (0:00)");
			tempsceneobject = new SceneObject("time", 300, 25, new VectorListItem(0, 0, [TimeLabel]));
			ArrayAddItem(HUDScene.items, tempsceneobject);
			
		}
		if (CreateScene("gameoversceen", 0, 0, 0, false))
		{
			GameOverScene = GetScene("gameoversceen");
			var tempsceneobject = new SceneObject("gameoversceneobject", 0, 0, new VectorListItem(0, 0, ASSET_GameOver));
			ArrayAddItem(GameOverScene.items, tempsceneobject);
			
			ReplayButton = new SceneObject("replaybutton", 300, 420, new VectorListItem(0, 0, [replaybuttonrec1, replaybuttonrec2, replaybuttontext]));
			ArrayAddItem(GameOverScene.items, ReplayButton);
			AddClickableSceneObject(GameOverScene, ReplayButton, onReplayClick, false, null);
		}
		//start the renderer (must pass in the context to initialize it)
		StartSceneRendererLoop(cxt, c);
	}
	
	function IsWinCondition ()
	{
		return false;
	}
	
	var RESETGAME_TIMEOUT = 4000;
	this.ShowGameOverScreen = function()
	{
		GameScene.visible = false;
		GameOverScene.visible = true;
		gameoverscoretext.content = "Final Score: " + scorevalue.toString();		
	}
	
	function GameOverReset()
	{
		InitGame();
		StartGame();
	}
	
	function onReplayClick ()
	{
		GameOverReset();
	}
		
	//Start game
	function StartGame()
	{
		InitGame();
		
		GameOverScene.visible = false;
		GameScene.visible = true;
		HUDScene.visible = true;
		
		TimeLeft = TOTALTIME;
		TimerActive = true;
	}
	
	var ramy = 0;
	
	function onBackgroundClick()
	{
		if (TimerActive == false)
			return;
			
		if (ramy == 0)
			ramy = 10;
	}
	
	function onDinoCollided (target)
	{
		//don't collide with explosions
		if (target.exploding)
			return;
		
		//bounce back
		targetforwardspeed = -15;
		setTimeout("this.ResetForwardSpeed()", RESETFORWARDSPEED_TIMEOUT);
		
		//blow up trees if they get smashed
		if (ramy > 0)
		{	
			var tempanimitem = new AnimatedItem(0, 0, ASSET_animtreearray, 100, 2, onTreeExplode, target);			
			target.renderitem = tempanimitem;
			target.exploding = true;
			tempanimitem.Play();
		}
	}
	
	function AddScore(value)
	{
		SetScore(scorevalue + value);
	}
	function SetScore(value)
	{
		scorevalue = value;
		ScoreLabel.content = "Score: " + scorevalue;
	}	
	
	function SetClockValue(timems)
	{
		var timetotalsec = Math.floor(timems / 1000);
		var secstring = (timetotalsec % 60).toString();
		if (secstring.length < 2)
		{
			secstring = "0" + secstring;
		}
		var timemin = Math.floor(timetotalsec / 60);
		TimeLabel.content = "Time (" + timemin.toString() + ":" + secstring + ")";
	}
	function TickDownClock()
	{
		if (TimeLeft > 0)
		{
			TimeLeft -= 33;
			SetClockValue(TimeLeft);
		}
		else
		{
			SetClockValue(0);
			TimerActive = false;
			TimeExpired();
		}
	}
	
	function TimeExpired()
	{
		this.ShowGameOverScreen();
	}

	function onTreeExplode (anim, sceneobject)
	{
		var scoreval = 10;
		if (sceneobject.name == "raptor")
		{
			scoreval = 50;
		}
		AddScore(scoreval);
		
		ArrayRemoveItem(GameScene.items, sceneobject);		
	}
	
	function UpdatePlayerPosition()
	{
		if (ramy > 0)
		{
			targetforwardspeed = -3;
			setTimeout("this.ResetForwardSpeed()", RESETFORWARDSPEED_TIMEOUT);
			
			if (ramy > chargestopframe)
			{
				var chargefraction = ramy - chargestopframe;
				DinoSceneObject.y = runnormaly - (chargedistance / chargefraction);
			}
			else
			{
				var chargefraction = ramy;
				DinoSceneObject.y = runnormaly - (chargedistance * (chargefraction / chargestopframe));
			}
			ramy--;
			//cant continue moving
			return;
		}
		
		DinoSceneObject.y = runnormaly;
		
		var halfwidth = DinoSceneObject.GetWidth() / 2;
		var mousepadding = 15;
		var xdiffereince = (DinoSceneObject.x + halfwidth) - Input.MouesPosX;
		var movedistance = 0;
		//move left
		if (xdiffereince > mousepadding)
		{
			movedistance = Math.min((xdiffereince - mousepadding) * dinospeedmod, dinomaxspeed);
			DinoSceneObject.x -= movedistance;
		}
		//move right
		else if	(xdiffereince < -mousepadding)
		{
			movedistance = Math.max((xdiffereince + mousepadding) * dinospeedmod, -dinomaxspeed);
			DinoSceneObject.x -= movedistance;
		}
	}
	
	function UpdateTrees()
	{
		//distance is calculated by running. (running backwards makes the next spawn take longer)
		treespawndistance += actualforwardspeed;
		
		if (treespawndistance >= treespawnlimit)
		{
			treespawndistance = 0;
			
			//GameScene = GetScene("gamescreen");
			var tempsceneobject;
			var randx = Math.floor(Math.random()*c.width);
			tempsceneobject = new SceneObject("tree", 0, -100, new VectorListItem(0, 0, ASSET_tree1));
			tempsceneobject.x = randx - (tempsceneobject.GetWidth() / 2);
			tempsceneobject.collision = new CollisionObject( 0, 0, 35, 50, null);
			tempsceneobject.exploding = false;
			ArrayAddItem(GameScene.items, tempsceneobject);
			
			var randspawn = Math.floor(Math.random()*3);
			if (randspawn == 1)
			{
				var raptory = Math.floor(Math.random()*50);
				tempsceneobject = new SceneObject("raptor", -100, raptory, ASSET_raptorimage.Clone());
				tempsceneobject.collision = new CollisionObject( 10, 10, 90, 100, null);
				tempsceneobject.exploding = false;
				ArrayAddItem(GameScene.items, tempsceneobject);
			}
		}
		
		//update all trees
		var currenttree;
		for (var i = GameScene.items.length - 1; i >= 0; i--)
		{
			var deletethis = false;
			
			//look at all trees
			currenttree = GameScene.items[i];
			if (currenttree.name == "tree" || currenttree.name == "raptor")
			{
				//update position
				currenttree.y += actualforwardspeed;				
				
				//if tree is off screen
				if (currenttree.y > c.height + 400)
				{
					//remove from scene
					deletethis = true;
				}
			}
			
			if (currenttree.name == "raptor" && currenttree.exploding == false)
			{
				currenttree.x += raptorspeed;
				if (currenttree.x > c.width + 100)
				{
					//remove from scene
					deletethis = true;
				}
			}
			if (deletethis)
			{
				ArrayRemoveIndex(GameScene.items, i);
			}
		}		
	}
	
	this.ResetForwardSpeed = function()
	{
		targetforwardspeed = maxforwardspeed;
	}
	
	function UpdateForwardSpeed()
	{
		if (targetforwardspeed > maxforwardspeed)
			targetforwardspeed = maxforwardspeed;
			
		if (actualforwardspeed != targetforwardspeed)
		{
			var difference = targetforwardspeed - actualforwardspeed;
			if (difference < forwardspeedsnap && difference > -forwardspeedsnap)
			{
				actualforwardspeed = targetforwardspeed;
			}
			else
			{
				actualforwardspeed += difference * forwardspeedmod;
			}
		}
	}
	
	//Set up game loop
	setInterval(mainLoop, 33);
	function mainLoop()
	{
		if (TimerActive)
		{
			UpdatePlayerPosition();
			UpdateForwardSpeed();
			UpdateTrees();
			
			TickDownClock();
		
			if (actualforwardspeed > 0)
				CheckSceneCollisions(GameScene);
		}
	}	
	
	//static call to start the game, since no assets need to load
	StartGame();	
}

MainGame();
