var SceneGlobals = new function()
{
	//object to hold scenes
	this.SceneCollection = new Array();
	this.RENDER_TIMEOUT = 33;
	this.rendertime = 0;
}

//Create a scene (by name) and add it to the SceneCollection array
// name = string to uniquely identify scene
// x = float x offset for drawing scene
// y = float y offset for drawing scene
// order = integer drawing order (for placing scenes on top or bottom)
// visible = boolean value to indicate if cene should be drawn
//Returns:
// true if successful or false if
function CreateScene(name, x, y, order, visible)
{
	//check if the scene name is already in use
	var sceneindex = ArrayFindIndexByName(SceneGlobals.SceneCollection, name);
	if (sceneindex > -1)
	{
		//don't add
		return false;
	}
	
	//create scene object
	var newScene =
	{
		name : name,
		x : x,
		y : y,
		order : order,
		visible : visible,
		items : new Array()
	}
	
	//add item into the array
	SceneGlobals.SceneCollection.push(newScene);
	
	return true;
}

//Adds a scene to the collection
//  scene = the scene object to add
//Returns:
//  true if adding was successful. False if a scene by the same name is already in the list
function AddScene(scene)
{
	//check if the scene name is already in use
	var sceneindex = ArrayFindIndexByName(SceneGlobals.SceneCollection, scene.name);
	if (sceneindex > -1)
	{
		//don't add
		return false;
	}
	
	//add and return success
	SceneGlobals.SceneCollection.push(scene);
	return true;
}

//Remove a scene from the collection based on name
// name = string that uniquely identifies the scene
function RemoveScene(name)
{
	//find scene from collection
	var sceneindex = ArrayFindIndexByName(SceneGlobals.SceneCollection, name);
	if (sceneindex > -1)
	{
		//remove item
		ArrayRemoveIndex(SceneGlobals.SceneCollection, sceneindex);
	}
}

//Gets scene object by name
//  name = string that uniquely identifies the scene
//returns:
//  the scene that matches the name or null if none are found
function GetScene(name)
{
	//find index
	var index = ArrayFindIndexByName(SceneGlobals.SceneCollection, name);
	//return scene if found
	if (index > -1)
	{
		return SceneGlobals.SceneCollection[index];
	}
	
	//otherwise return null
	return null;
}

//Get the count of scenes
//Returns:
// Number of scenes
function GetSceneCount()
{
	return SceneGlobals.SceneCollection.length;
}

//Renders all scenes in the collection using the RenderScene functionality in render.js
//  context = drawing context object from html
function RenderScenes(context, canvas)
{
	//cycle through all scenes
	for (var i = 0; i < SceneGlobals.SceneCollection.length; i++)
	{
		//check if scene is set to visible
		if (SceneGlobals.SceneCollection[i].visible == true)
		{
			//render scene
			RenderScene(context, canvas, SceneGlobals.SceneCollection[i]);
		}
	}
}

//variable to hold a reference to the context
var renderContextHandle = null;
var renderCanvasHandle = null;

//Sets up and starts the loop for rendering
//  context = drawing context object from html
function StartSceneRendererLoop(context, canvas)
{
	renderContextHandle = context;
	renderCanvasHandle = canvas;
	setInterval(SceneRendererLoop, SceneGlobals.RENDER_TIMEOUT);
	SceneRendererLoop();
}

//Processing function for the rendering loop
//  Performs off the actual rendering for all visuals
function SceneRendererLoop()
{
	RenderScenes(renderContextHandle, renderCanvasHandle);
	SceneGlobals.rendertime += SceneGlobals.RENDER_TIMEOUT;
}