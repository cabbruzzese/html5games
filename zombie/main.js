(function MainGame () {
    var BGScene;
	var GameScene;
	var GameOverScene;
    var HUDScene;
    
    function InitializeScenes()
	{
		if (CreateScene("background", 0, 0, 0, true, [ASSETS.BACKGROUND]))
		{
			BGScene = GetScene("background");
		}
		if (CreateScene("gamescreen", 0, 0, 0, true))
		{
            GameScene = GetScene("gamescreen");
            var playerSceneObject = new SceneObject("player", ASSETS.BACKGROUND_WIDTH / 2, ASSETS.BACKGROUND_HEIGHT / 2, new VectorListItem(0, 0, [ASSETS.PLAYER]));
            GameScene.items.push(playerSceneObject);
            
            ASSETS.PLAYER_LEGS_RUNNING.Play();
		}
		if (CreateScene("hud", 0, 0, 0, false))
		{
			HUDScene = GetScene("hud");			
		}
		if (CreateScene("gameoversceen", 0, 0, 0, false))
		{
			GameOverScene = GetScene("gameoversceen");			
		}
		StartSceneRendererLoop(cxt, c);
    }

    InitializeScenes();
})();