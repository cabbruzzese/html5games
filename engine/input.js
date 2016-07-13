var Input = new function()
{
	this.ClickableList = new Array();
	this.MouseInputPaused = false;
	
	this.MouesPosX = 0;
	this.MousePosY = 0;
	
	this.leftarrow = 37;
	this.uparrow = 38;
	this.rightarrow = 39;
	this.downarrow = 40;
	this.keya = 65;
	this.keyw = 87;
	this.keys = 83;
	this.keyd = 68;
	this.keyrctrl = 70;
	this.keyboardslash = 191;
	this.space = 32;
}

function inputitem(itemleft, itemtop, itemright, itembottom, itemcallback, itemmodal, args, scene)
{
	this.left = itemleft;
	this.top = itemtop;
	this.right = itemright;
	this.bottom = itembottom;
	this.callback = itemcallback;
	this.modal = itemmodal;
	this.args = args;
	this.scene = scene;
	return this;
}

//Set up click event (browser based)
function AddClick(element, event)
{
	if ( element.addEventListener )
	{
		element.addEventListener("click", event, false);	
	} 
	else if ( element.attachEvent )
	{
		element.attachEvent("onclick", event);
	}
}
//Set up mousemove event (browser based)
function AddMouseMove(element, event)
{
	if ( element.addEventListener )
	{
		element.addEventListener("mousemove", event, false);	
	} 
	else if ( element.attachEvent )
	{
		element.attachEvent("onmousemove", event);
	}
}

function onCanvasMouseMove(e)
{
	Input.MouesPosX = e.offsetX;
	Input.MouesPosY = e.offsetY;
}

//main click event
// Cycles through ClickableList and checks if click is in bounds
//   All elements must have the following properties
//     left: left x position
//     top: top y position
//     right: right x position
//     bottom: bottom y position
//     callback(e): function to call (accepting the mouse event object)
//     modal: boolean to see if there should be a clickthrough for this item
function onCanvasClick (e)
{
	//static value that prevents mouse inputs
	if (Input.MouseInputPaused)
		return;

	//get mouse position relative to canvas
	var xpos = e.offsetX;
	var ypos = e.offsetY;
	
	var curinputitem;
	//cycle through list
	for (var listx = 0; listx < Input.ClickableList.length; listx++)
	{
		//check bounds
		curinputitem = Input.ClickableList[listx];
		if (xpos > curinputitem.left && xpos < curinputitem.right &&
			ypos > curinputitem.top && ypos < curinputitem.bottom)
		{
			if (curinputitem.scene == null || curinputitem.scene.visible == true)
			{
				//call click callback if the click was in bounds
				curinputitem.callback(e, curinputitem.args);
				//if item is modal
				if (curinputitem.modal == true)
				{
					//return to avoid running click event on any other item
					return;
				}
			}
		}
	}
}

//register main click event
function InitializeInput(canvas)
{
	Input.MouseInputPaused = false;
	Input.ClickableList = new Array();
	AddClick(canvas, onCanvasClick);
	AddMouseMove(canvas, onCanvasMouseMove);
}

function AddClickableItem(itemleft, itemtop, itemright, itembottom, itemcallback, itemmodal, args, scene)
{
	var item = new inputitem(itemleft, itemtop, itemright, itembottom, itemcallback, itemmodal, args, scene);
	Input.ClickableList[Input.ClickableList.length] = item;
}

function AddClickableSceneObject(scene, sceneobject, itemcallback, itemmodal, args)
{
	var left = scene.x + sceneobject.x;
	var top = scene.y + sceneobject.y;
	var right = left + sceneobject.GetWidth();
	var bottom = top + sceneobject.GetHeight();
	
	AddClickableItem(left, top, right, bottom, itemcallback, itemmodal, args, scene);
}