function MainGame ()
{
	//Create handle to canvas object
	var c=document.getElementById("myCanvas");
	var cxt=c.getContext("2d");

	InitializeInput(c);
	InitializeScenes();

	var numcardsselected;
	var lastselectedcard;
	var selectedcard;
	
	var LetterOptions = ["A", "B", "C", "D", "E", "F"];
	var griddata;
	function InitGame()
	{
		griddata = new Array();		
		numcardsselected = 0;
		selectedcard = null;
		lastselectedcard = null;
		
		ResetAllCards();
	}
	
	function OnResetButtonClick(e)
	{
		StartGame();
	}
	//AddClickableItem(resetbutton.x, resetbutton.y, resetbutton.x + 50, resetbutton.y + 30, OnResetButtonClick, true);
		
	function InitializeCard(name, x, y, isfront, cardvalue)
	{
		tempsceneobject = new SceneObject(name, x, y, new VectorListItem(0, 0, CloneArray(ASSET_cardback)));
		tempsceneobject.IsFront = isfront;
		tempsceneobject.cardvalue = cardvalue;
		tempsceneobject.matchfound = false;
		UpdateCardDrawingList(tempsceneobject);
		
		return tempsceneobject;
	}
	
	function ResetCard(tempsceneobject)
	{
		tempsceneobject.IsFront = false;
		tempsceneobject.matchfound = false;
	}
	function ResetAllCards ()
	{
		var tempsceneobject;
		for (var i = 0; i < GameScene.items.length; i++)
		{
			tempsceneobject = GameScene.items[i];
			ResetCard(tempsceneobject);
			UpdateCardDrawingList(tempsceneobject);
		}
	}
	
	function AddCardToScene(tempsceneobject)
	{
		ArrayAddItem(GameScene.items, tempsceneobject);
		AddClickableSceneObject(GameScene, tempsceneobject, Card_OnClick, true, [tempsceneobject.name]);
	}
	
	function  UpdateCardDrawingList(tempsceneobject)
	{
		if (tempsceneobject.matchfound == true)
		{
			//don't display found cards
			tempsceneobject.renderitem = new VectorListItem(0, 0, new Array());
		}
		else if (tempsceneobject.IsFront == false)
		{
			tempsceneobject.renderitem = new VectorListItem(0, 0, CloneArray(ASSET_cardback));
		}
		else
		{
			tempsceneobject.renderitem = new VectorListItem(0, 0, CloneArray(ASSET_cardfront));
			ArrayAddItem(tempsceneobject.renderitem.vectoritems, new TextItem (10, 80, "48pt Arial", "#DDDDDD", tempsceneobject.cardvalue));
		}
	}
	
	function  AddCardWinGraphic(tempsceneobject)	
	{
		var assetarray = JoinArray(CloneArray(ASSET_cardwin), CloneArray(ASSET_cardfront));
		tempsceneobject.renderitem = new VectorListItem(0, 0, CloneArray(assetarray));
		ArrayAddItem(tempsceneobject.renderitem.vectoritems, new TextItem (10, 80, "48pt Arial", "#DDDDDD", tempsceneobject.cardvalue));
	}
		
	var BGScene;
	var GameScene;
	var GameOverScene;
	function InitializeScenes()
	{
		if (CreateScene("background", 0, 0, 0, true))
		{
			BGScene = GetScene("background");
			var backgroundobject = new SceneObject("backgroundobject", 0, 0, new VectorListItem(0, 0, ASSET_background));
			ArrayAddItem(BGScene.items, backgroundobject);
		}
		if (CreateScene("gamescreen", 0, 0, 0, false))
		{
			GameScene = GetScene("gamescreen");
			var tempsceneobject;
			
			tempsceneobject = InitializeCard("card1", 50, 50, false, "A");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card2", 160, 50, false, "B");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card3", 270, 50, false, "C");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card4", 380, 50, false, "D");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card5", 50, 180, false, "E");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card6", 160, 180, false, "F");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card7", 270, 180, false, "A");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card8", 380, 180, false, "B");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card9", 50, 310, false, "C");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card10", 160, 310, false, "D");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card11", 270, 310, false, "E");
			AddCardToScene(tempsceneobject);
		
			tempsceneobject = InitializeCard("card12", 380, 310, false, "F");
			AddCardToScene(tempsceneobject);
		}
		if (CreateScene("gameoversceen", 0, 0, 0, false))
		{
			GameOverScene = GetScene("gameoversceen");
			var gameoversceneobject = new SceneObject("gameoversceneobject", 0, 0, new VectorListItem(0, 0, ASSET_GameOver));
			ArrayAddItem(GameOverScene.items, gameoversceneobject);
		}
		//start the renderer (must pass in the context to initialize it)
		StartSceneRendererLoop(cxt, c);
	}
	
	var CLEARCARDANIMATION_TIMEOUT = 1000;
	var DISPLAYWINTEXT_TIMEOUT = 1000;
	var RESETGAME_TIMEOUT = 4000;
	//Click event for all card object
	// e = click event object
	// args = array of args.
	//   [0] = name of sceneobject	
	function Card_OnClick(e, args)
	{	
		selectedcard = GameScene.items[ArrayFindIndexByName(GameScene.items, args[0])];

		//can't select after 2 are in use
		if (numcardsselected >= 2)
			return;
		//can't select same card twice
		if (selectedcard == lastselectedcard)
			return;

		if (selectedcard.IsFront == false)
			selectedcard.IsFront = true;
			
		UpdateCardDrawingList(selectedcard);
		numcardsselected ++;
		if (numcardsselected == 1)
		{
			lastselectedcard = selectedcard;
		}
		if (numcardsselected == 2)
		{
			//pause inputs until lose/win animations are done
			MouseInputPaused = true;
			
			if (selectedcard.cardvalue == lastselectedcard.cardvalue)
			{
				AddCardWinGraphic(selectedcard);
				AddCardWinGraphic(lastselectedcard);
				setTimeout("ClearMatchCardAnimation(true)", CLEARCARDANIMATION_TIMEOUT);
			}
			else
			{
				setTimeout("ClearMatchCardAnimation(false)", CLEARCARDANIMATION_TIMEOUT);
			}
		}
	}
	
	function IsWinCondition ()
	{
		for (var i = 0; i < GameScene.items.length; i++)
		{
			if (GameScene.items[i].matchfound == false)
				return false;
		}
		
		return true;
	}
	
	this.ClearMatchCardAnimation = function (matchfound)
	{
		if (matchfound == true)
		{
			selectedcard.matchfound = true;
			lastselectedcard.matchfound = true;
		}
		else
		{
			selectedcard.IsFront = false;
			lastselectedcard.IsFront = false;
		}
		
		UpdateCardDrawingList(selectedcard);
		UpdateCardDrawingList(lastselectedcard);
		
		MouseInputPaused = false;
		
		numcardsselected = 0;
		selectedcard = null;
		lastselectedcard = null;
		
		if (IsWinCondition() == true)
		{
			setTimeout("ShowGameOverScreen()", DISPLAYWINTEXT_TIMEOUT);
		}
	}
	
	this.ShowGameOverScreen = function()
	{
		GameScene.visible = false;
		GameOverScene.visible = true;
		setTimeout("GameOverReset()", RESETGAME_TIMEOUT);
	}
	this.GameOverReset = function()
	{
		InitGame();
		StartGame();
	}
		
	function RandomizeGridData()
	{
		//make a copy of the letter array twice (So that 2 sets of cards match)
		var tempoptions = JoinArray(LetterOptions, LetterOptions);
		
		while(tempoptions.length > 0)
		{
			var randnum = Math.floor(Math.random()*tempoptions.length);
			ArrayAddItem(griddata, tempoptions[randnum]);
			ArrayRemoveIndex(tempoptions, randnum);
		}
	}	
	
	function UpdateCardValue(cardobj, isfront, cardvalue)
	{	
		cardobj.IsFront = isfront;
		cardobj.cardvalue = cardvalue;	
		UpdateCardDrawingList(tempsceneobject);
	}
	
	function SetUpCardValues()
	{
		for (var i = 0; i < GameScene.items.length; i++)
		{
			UpdateCardValue(GameScene.items[i], false, griddata[i]);
		}
	}
		
	//Start game
	function StartGame()
	{
		InitGame();
		RandomizeGridData();
		SetUpCardValues();
		
		GameOverScene.visible = false;
		GameScene.visible = true;
	}
	
	//Set up game loop
	setInterval(mainLoop, 33);
	function mainLoop()
	{
	}	
	
	//static call to start the game, since no assets need to load
	StartGame();
}

MainGame();
