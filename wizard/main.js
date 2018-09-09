function MainGame ()
{
	//Create handle to canvas object
	var c=document.getElementById("myCanvas");
	var cxt=c.getContext("2d");

	InitializeInput(c);
	
	//inline call to load the xml level before starting the game
	var LevelXML;
	function LoadXML()
	{
		//LevelXML = TileGlobals.FetchLevelData("testlevel1.xml");

		//Local Testing with string in js file
		var xmlParser = new DOMParser();
		LevelXML = xmlParser.parseFromString(LEVEL_1_DATA, "text/xml");
	}
	LoadXML();


		
	var BGScene;
	var GameScene;
	var GameOverScene;
	var HUDScene;
	
	var PlayerObject;
	var PlayerWalkAnim;
	var PlayerAttackAnim;
	var monsters = [];
	var fireballs = [];
	var sparkles = [];

	InitializeScenes();

	//turn on collision debugging
	PhysicsGlobals.IsDebug = false;
	
	function InitGame()
	{
		PlayerObject.paintime = 0;
	}
	
	function InitializeScenes()
	{
		if (CreateScene("background", 0, 0, 0, true))
		{
			BGScene = GetScene("background");
			var backgroundobject = new SceneObject("backgroundobject", 0, 0, new VectorListItem(0, 0, ASSET_background));
			BGScene.items.push(backgroundobject);
		}
		if (CreateScene("gamescreen", 0, 0, 0, false))
		{
			GameScene = GetScene("gamescreen");
			var tempsceneobject;
			
			PlayerWalkAnim = new AnimatedItem(0, 0, ASSET_animwalk, 200, -1, null, null);
			PlayerAttackAnim = new AnimatedItem(0, 0, ASSET_animattack, 200, 1, PlayerAttackFinish, null);
			
			tempsceneobject = new SceneObject("wizard", 64, 96, PlayerWalkAnim);
			GameScene.items.push(tempsceneobject);
			tempsceneobject.collision = new CollisionObject( 10, 0, 54, 96, null);
			PlayerObject = tempsceneobject;
			PlayerObject.x = 200;
			PlayerObject.y = 70;
			
			PlayerObject.paintime = 0;
			
			var monster1 = new Monster(100, 70, "test");
			monsters.push(monster1);
			
			TileGlobals.BlockCollidedCallback = onBlockCollided;
			TileGlobals.ParseXMLObject(LevelXML);
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
		if (CreateScene("gameoversceen", 0, 0, 0, false))
		{
			GameOverScene = GetScene("gameoversceen");
			// var tempsceneobject = new SceneObject("gameoversceneobject", 0, 0, new VectorListItem(0, 0, ASSET_GameOver));
			// GameOverScene.items.push(tempsceneobject);
			
			// ReplayButton = new SceneObject("replaybutton", 300, 420, new VectorListItem(0, 0, [replaybuttonrec1, replaybuttonrec2, replaybuttontext]));
			// GameOverScene.items.push(ReplayButton);
			// AddClickableSceneObject(GameOverScene, ReplayButton, onReplayClick, false, null);
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
		
		PlayerObject.collision.onground = false;
		PlayerObject.collision.targetspeedx = 0;
		PlayerObject.collision.curspeedx = 0;
		
		GameOverScene.visible = false;
		GameScene.visible = true;
		HUDScene.visible = true;
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
	
	function onBlockCollided (obj1, obj2)
	{
		
		//player in the air
		if (obj2 == PlayerObject || obj2.name == "monster")
		{
			SolidCollide(obj1, obj2);
		}
	}
	
	function UpdatePlayerPosition()
	{
		
		PlayerObject.collision.UpdatePosition(PlayerObject);
		
		RenderGlobals.CameraX = (PlayerObject.x + (PlayerObject.GetWidth() / 2)) - (c.width / 2);
		RenderGlobals.CameraY = (PlayerObject.y + (PlayerObject.GetHeight() / 2)) - (c.height / 2);
		
		//animations
		//if walking
		if (PlayerObject.collision.curspeedx != 0 &&
			PlayerObject.renderitem == PlayerWalkAnim)
		{
			//change direction
			if (PlayerObject.collision.targetspeedx < 0)
				PlayerObject.invertX = true;
			else if (PlayerObject.collision.targetspeedx > 0)
				PlayerObject.invertX = false;
			
			//play animation
			PlayerWalkAnim.Play();			
		}
		else
		{
			//not walking
			PlayerWalkAnim.Pause();
		}
		
		//update paintime value
		if (PlayerObject.paintime > 0)
			PlayerObject.paintime--;
	}
	
	//Set up game loop
	setInterval(mainLoop, 33);
	function mainLoop()
	{
		ProcessKeys();
		//always mark for gravity in case collision goes away
		PlayerObject.collision.onground = false;	
		CheckSceneCollisions(GameScene);
		UpdatePlayerPosition();
		SparkleThink();
		MonsterThink();
		FireballThink();
	}	
	
	function KillMonster(monster)
	{
		if (monster.fireball != null)
		{
			KillFireBall(monster.fireball);
		}
		ArrayRemoveItem(GameScene.items, monster.sceneobject);
		ArrayRemoveItem(monsters, monster);
	}
	
	function Monster(x, y, type)
	{
		this.name = "monster";
		this.type = type;
		
		var asset = new AnimatedItem(0, 0, ASSET_animwalk, 200, -1, null, null);
		this.sceneobject = new SceneObject("monster", 64, 64, asset);
		this.sceneobject.collision = new CollisionObject( 10, 0, 54, 64, null);
		this.sceneobject.x = x;
		this.sceneobject.y = y;
		this.fireball = null;
		
		this.health = 1;
		this.lastmovetime = 0;
		this.lastshoottime = 0;
		this.lastdir = 1;
		
		GameScene.items.push(this.sceneobject);
	}
	
	function KillFireBall(fireball)
	{
		if (fireball.monster != null)
		{
			fireball.monster.fireball = null;
		}
		fireball.monster = null;
		ArrayRemoveItem(fireballs, fireball);
		ArrayRemoveItem(GameScene.items, fireball);
	}
	
	function onFireballHit(fireball, obj2)
	{
		if (obj2.name == TileGlobals.TileType_Block)
		{
			KillFireBall(fireball);
		}
		else if (obj2 == PlayerObject)
		{
			var speedvalue = 20;
			if (fireball.collision.targetspeedx < 0)
			{
				speedvalue *= -1;
			}
			PlayerObject.collision.curspeedx = speedvalue;
			PlayerObject.collision.curspeedy = -10;
			PlayerObject.paintime = 9;
			
			KillFireBall(fireball);
		}
		else if (fireball.hitback == false && obj2.name == "sparkle")
		{
			//swap x speed
			var xspeed = fireball.collision.maxspeed * -1;
			fireball.collision.targetspeedx = xspeed;
			fireball.collision.curspeedx = xspeed;
			
			//apply y for distance
			var yspeed = -4;
			fireball.collision.targetspeedy = yspeed;
			fireball.collision.curspeedy = yspeed;
			
			fireball.hitback = true;
		}
		else if (fireball.hitback && obj2 == fireball.monster.sceneobject)
		{
			KillMonster(fireball.monster);
		}
	}
	
	function ShootFireball(monster, xspeed)
	{
		var fireballitem = new VectorListItem(0, 0, ASSET_fireball);
		var fireball = new SceneObject("fireball", 0, 0, fireballitem);
		GameScene.items.push(fireball);
		fireball.collision = new CollisionObject( 0, 0, 16, 16, onFireballHit);
		fireball.collision.maxspeed = xspeed;
		fireball.collision.targetspeedx = xspeed;
		fireball.collision.curspeedx = xspeed;
		fireball.collision.targetspeedy = -3;
		fireball.collision.curspeedy = -3;
		fireball.collision.gravitymodifier = 0.25;
		fireball.collision.selfpropelled = true;
		monster.fireball = fireball;
		fireball.monster = monster;
		fireball.hitback = false;
		fireball.x = monster.sceneobject.x;
		//fireball.y = monster.sceneobject.y +(monster.sceneobject.GetHeight() / 2);
		fireball.y = monster.sceneobject.y;
		
		fireballs.push(fireball);
	}
	
	function FireballThink()
	{
		for (var i = 0; i < fireballs.length; i++)
		{
			var fireball = fireballs[i];
			if (fireball.monster != null)
			{
				fireball.collision.onground = false;				
				fireball.collision.UpdatePosition(fireball);
			}
		}
	}
	
	function MonsterThink()
	{
		for (var i = 0; i < monsters.length; i++)
		{
			var monster = monsters[i];
			if (monster.health > 0)
			{
				//end moving
				if (monster.lastmovetime == 40)
				{
					monster.lastmovetime = 0;
				}
				if (monster.lastmovetime == 25)
				{
					monster.sceneobject.collision.targetspeedx = 0;
				}
				//start random move
				else if (monster.lastmovetime == 5)
				{
					monster.lastdir = 1;
					if (Math.floor((Math.random()*2)+1) == 1)
					{
						monster.lastdir = -1;
					}
					
					monster.sceneobject.collision.targetspeedx = 20 * monster.lastdir;
				}
				
				monster.lastmovetime++;
				monster.sceneobject.collision.UpdatePosition(monster.sceneobject);
				
				monster.sceneobject.collision.onground = false;
				
				monster.lastshoottime++;
				if (monster.lastshoottime == 70)
				{
					//pause to shoot again if already have a fireball
					if (monster.fireball != null)
					{
						monster.lastshoottime -= 20;
					}
					else
					{
						ShootFireball(monster, 10 * monster.lastdir);
						monster.lastshoottime = 0;
					}
				}
			}
		}
	}
	
	function KillSparkle(sparkle)
	{
		ArrayRemoveItem(sparkles, sparkle);
		ArrayRemoveItem(GameScene.items, sparkle);
	}
	
	function UpdateSparklePosition(sparkle)
	{
		//update sparkle position
		if (PlayerObject.invertX)
		{
			//left
			sparkle.x = PlayerObject.x - sparkle.GetWidth() - 1;
			sparkle.y = PlayerObject.y + 24;
		}
		else
		{
			sparkle.x = PlayerObject.x + PlayerObject.GetWidth() + 1;
			sparkle.y = PlayerObject.y + 24;
		}
	}
	
	function SparkleThink()
	{
		//cycle backwards because we're removing items from the array
		for (var i = sparkles.length; i > 0; i--)
		{
			var sparkle = sparkles[i - 1];
			
			UpdateSparklePosition(sparkle);
		
			sparkle.lifetime--;
			if (sparkle.lifetime == 0)
			{
				KillSparkle(sparkle);
			}
		}
	}
	
	var playerjumpspeed = 22;
	function MovePlayerX(speed, direction)
	{
		PlayerObject.collision.targetspeedx += speed;
		
		//snap to max speed
		if (PlayerObject.collision.targetspeedx > PlayerObject.collision.maxspeed)
			PlayerObject.collision.targetspeedx = PlayerObject.collision.maxspeed;
		if (PlayerObject.collision.targetspeedx < (PlayerObject.collision.maxspeed * -1))
			PlayerObject.collision.targetspeedx = PlayerObject.collision.maxspeed * -1;
	}
	function Jump(speed, direction)
	{
		if (PlayerObject.collision.onground == false)
			return;
		
		PlayerObject.collision.onground = false;
		PlayerObject.collision.targetspeedy = speed;
		
		//snap to max speed
		if (PlayerObject.collision.targetspeedy < (playerjumpspeed * -1))
			PlayerObject.collision.targetspeedy = playerjumpspeed;
			
		//offset to force offground
		PlayerObject.y -= 10;
	}
	function PlayerAttack()
	{
		//can't attack while already attacking
		if (PlayerAttackAnim.pause == false)
			return;
			
		PlayerObject.renderitem = PlayerAttackAnim;
		PlayerAttackAnim.Play();
		
		//create sparkle object
		var sparkleitem = new VectorListItem(0, 0, ASSET_sparkle);
		var sparkle = new SceneObject("sparkle", 0, 0, sparkleitem);
		GameScene.items.push(sparkle);
		sparkle.collision = new CollisionObject( 0, 0, 32, 48, null);
		sparkle.lifetime = 22;
		UpdateSparklePosition(sparkle);
		sparkles.push(sparkle);
	}
	function PlayerAttackFinish(obj, args)
	{
		PlayerObject.renderitem = PlayerWalkAnim;
		PlayerWalkAnim.Pause();
		PlayerAttackAnim.Reset();
	}
	
	var airmovemodifier = 0.17;
	function PlayerMoveRight()
	{
		//no inputs when hurt
		if (PlayerObject.paintime > 0)
			return;
			
		var moveval = PlayerObject.collision.maxspeed;
		if (PlayerObject.collision.onground == false)
		{
			moveval *= airmovemodifier;
		}
		MovePlayerX(moveval, "right");
	}
	function PlayerMoveLeft()
	{
		//no inputs when hurt
		if (PlayerObject.paintime > 0)
			return;
			
		var moveval = PlayerObject.collision.maxspeed * -1;
		if (PlayerObject.collision.onground == false)
		{
			moveval *= airmovemodifier;
		}
		MovePlayerX(moveval, "left");
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
	
	function ProcessKeys()
	{
		for (var i = 0; i < KeysDown.length; i++)
		{
			var key = KeysDown[i];
			switch(key)
			{
				case Input.rightarrow: 	
					PlayerMoveRight();
					break;
				case Input.leftarrow: 	
					PlayerMoveLeft();
					break;
			}
		}
	}
	
	StartGame();
}

MainGame();
