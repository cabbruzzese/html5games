//---------------------
//Global Values
//---------------------
var RenderGlobals = new function()
{
	this.TotalImageItemAsset = 0;
	this.ImageItemsDownloaded = 0;
	
	this.CameraX = 0;
	this.CameraY = 0;
	this.CameraBG = "#000000";
	
	//Callback to increase download counter
	this.ImageLoadCallback = function ()
	{
		this.ImageItemsDownloaded++;
	}
	//Function to check if all image items have loaded
	//Returns: true if total is equal to downloaded. false otherwise. 
	//****
	// Note:(0 TotalImageItemAsset causes a false positive)
	//****
	this.CheckImageItemsLodaed = function()
	{
		if (this.ImageItemsDownloaded == this.TotalImageItemAsset)
			return true;

		return false;
	}
	
	this.RestCamera = function()
	{
		this.CameraX = 0;
		this.CameraY = 0;
	}
	
	this.PaintCameraBack = function(context, canvas)
	{
		context.save();
		//context.translate(this.CameraX, this.CameraY);
		context.translate(0, 0);
		context.fillStyle = this.CameraBG
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.restore();
	}
}

//----------------------
//Object Constructors
//----------------------
function ImageItem (x, y, image, imageurl)
{
	this.type = "image";
	
	this.image = image;
	if (this.image == null)
	{
		//download image
		this.image = new Image();
		this.image.onLoad = RenderGlobals.ImageLoadCallback;
		this.image.src = imageurl;
		RenderGlobals.TotalImageItemAssets++;
	}
	
	this.x = x;
	this.y = y;
	this.rotation = 0;
	
	this.invertX = false;
	this.invertY = false;
	this.IsStationary = false;
	
	this.GetWidth = function()
	{
		return this.image.width;
	}
	this.GetHeight = function()
	{
		return this.image.height;
	}
	this.GetCenterX = function()
	{
		return (x - (this.GetWidth() / 2));
	}
	this.GetCenterY = function()
	{
		return (y - (this.GetHeight() / 2));
	}
	
	this.Clone = function()
	{
		return new ImageItem(this.x, this.y, null, this.image.src);
	}
}
function TextItem (x, y, font, fillstyle, content)
{
	this.type = "text";
	this.x = x;
	this.y = y;
	this.font = font;
	this.fillstyle = fillstyle;
	this.content = content;
	this.rotation = 0;
	
	//positioning that must exist for rotation
	this.left = x;
	this.top = y;
	this.right = x;
	this.bottom = y;

	this.invertX = false;
	this.invertY = false;
	this.IsStationary = false;
	
	this.GetWidth = function()
	{
		return 0; //unsupported
	}
	this.GetHeight = function()
	{
		return 0; //unsupported
	}
	this.GetCenterX = function()
	{
		return (x - (this.GetWidth() / 2));
	}
	this.GetCenterY = function()
	{
		return (y - (this.GetHeight() / 2));
	}
	
	this.Clone = function()
	{
		return new ImageItem(this.x, this.y, this.font, this.fillstyle, this.content);
	}
}
function VectorListItem (x, y, vectoritems)
{
	this.vectoritems = vectoritems;
	this.type = "vectorlist";
	this.x = x;
	this.y = y;
	this.rotation = 0;

	this.invertX = false;
	this.invertY = false;
	this.IsStationary = false;
		
	this.GetWidth = function()
	{
		var largestval = 0;
		var currentval = 0;
		for (var i = 0; i < this.vectoritems.length; i++)
		{
			currentval = this.vectoritems[i].GetWidth();
			if (currentval > largestval)
				largestval = currentval;
		}
		
		return largestval;
	}
	this.GetHeight = function()
	{
		var largestval = 0;
		var currentval = 0;
		for (var i = 0; i < this.vectoritems.length; i++)
		{
			currentval = this.vectoritems[i].GetHeight();
			if (currentval > largestval)
				largestval = currentval;
		}
		
		return largestval;
	}
	this.GetCenterX = function()
	{
		return (x - (this.GetWidth() / 2));
	}
	this.GetCenterY = function()
	{
		return (y - (this.GetHeight() / 2));
	}
	
	this.Clone = function()
	{
		var copy = new VectorListItem(this.x, this.y, []);
		for (var i = 0; i < this.vectoritems.length; i++)
		{
			var itemCopy = this.vectoritems[i].Clone();
			copy.vectoritems.push(itemCopy);
		}
		
		return copy;
	}
}

function VectorItem (type, fillstyle, left, top, right, bottom)
{
	this.type = type;//"line", "circle", "rectangle", "text"
	this.fillstyle = fillstyle;
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
	this.rotation = 0;

	this.invertX = false;
	this.invertY = false;
	this.IsStationary = false;
		
	this.GetWidth = function()
	{
		var val = right;
		if (val < 0)
			val = 0;
			
		return val;
	}
	this.GetHeight = function()
	{
		var val = bottom;
		if (val < 0)
			val = 0;
			
		return val;
	}
	this.GetCenterX = function()
	{
		return (x - (this.GetWidth() / 2));
	}
	this.GetCenterY = function()
	{
		return (y - (this.GetHeight() / 2));
	}
	
	this.Clone = function()
	{
		var copy = new VectorItem(this.type, this.fillstyle, this.left, this.top, this.right, this.bottom);
		return copy;
	}
}

function AnimatedItem (x, y, frames, delay, repeated, callback, arguments)
{
	this.type = "animated";
	this.x = x;
	this.y = y;
	this.repeated = repeated;//number of times to repeat. -1 means always repeat
	this.callback = callback;
	this.arguments = arguments;
	this.frames = frames; //array of imageitems or vetorlist items
	this.currentframe = 0;
	this.delay = delay;
	this.lastframetime = 0;
	this.timesrepeated = 0;
	this.pause = true;
	this.rotation = 0;

	this.invertX = false;
	this.invertY = false;
	this.IsStationary = false;
		
	this.UpdateFrameTime = function(timeout)
	{
		if (this.pause)
			return;
			
		if (this.timesrepeated == this.repeated)
		{
			this.pause = true;
			if (this.callback != null)
			{
				this.callback(this, this.arguments);
			}
			return;
		}
			
		//update timer between frames based on render loop timeout
		this.lastframetime += timeout;
	
		//if frametime is greater than expected delay
		if (this.lastframetime >= this.delay)
		{
			//reset timeout
			this.lastframetime = 0;
			//update frame
			this.currentframe++;
			if (this.currentframe >= this.frames.length)
			{
				this.timesrepeated++;
				this.currentframe = 0;
			}
		}
	}
	
	this.Pause = function()
	{
		this.pause = true;
	}
	
	this.Play = function()
	{
		this.pause = false;
	}
	
	this.Reset = function()
	{
		this.pause = true;
		this.lastframetime = 0;
		this.timesrepeated = 0;
		this.currentframe = 0;
	}
	
	this.GetWidth = function()
	{
		return this.frames[this.currentframe].GetWidth();;
	}
	this.GetHeight = function()
	{
		return this.frames[this.currentframe].GetHeight();
	}
	this.GetCenterX = function()
	{
		return this.frames[this.currentframe].GetCenterX();
	}
	this.GetCenterY = function()
	{
		return this.frames[this.currentframe].GetCenterY();
	}
	
	this.Clone = function()
	{
		var copy = new AnimatedItem (this.x, this.y, [], this.delay, this.repeated, this.callback, this.arguments);
		for (var i = 0; i < this.frames.length; i++)
		{
			var frameCopy = this.frames[i].Clone();
			copy.frames.push(frameCopy);
		}
		
		return copy;
	}
}

function SceneObject (name, x, y, renderitem)
{
	this.type = "sceneobject";
	this.name = name;
	this.x = x;
	this.y = y;
	this.renderitem = renderitem;
	this.collision = null;
	this.rotation = 0;
	
	this.invertX = false;
	this.invertY = false;
	this.IsStationary = false;
	
	this.GetWidth = function()
	{
		return renderitem.GetWidth();
	}
	this.GetHeight = function()
	{
		return renderitem.GetHeight();
	}
	this.GetCenterX = function()
	{
		return (x - (this.GetWidth() / 2));
	}
	this.GetCenterY = function()
	{
		return (y - (this.GetHeight() / 2));
	}
	
	this.Clone = function()
	{
		var copy = new SceneObject(this.name, this.x, this.y, this.renderitem);
		return copy;
	}
}

function invertandtranslatecontext(context, canvas, item, offsetx, offsety)
{
	var invertxval = 1;
	var invertyval = 1;
	
	var translatex = offsetx;
	var translatey = offsety;
	if (item.IsStationary == false)
	{
		translatex -= RenderGlobals.CameraX;
		translatey -= RenderGlobals.CameraY;
	}
	if (item.invertX || item.invertY)
	{
		if (item.invertX) { invertxval = -1; }
		if (item.invertY) { invertyval = -1; }
		
		context.scale(invertxval, invertyval);
		
		context.save();	
		 if (invertxval == -1)
			 translatex = (translatex * -1) - item.GetWidth();
		 if (invertyval == -1)
			 translatey = (translatex * -1) - item.GetHeight();
		context.translate(translatex, translatey);
		return;
	}
	
	//save translation
	context.save();
	context.translate( translatex, translatey);
	return
}

//Renders all scene items into the scene based on their drawing type
// context = reference to the canvas object
// sceneitems = array containing ONLY scene items
function RenderScene (context, canvas, scene)
{	
	var sceneitems = scene.items;
	for (var i = 0; i < sceneitems.length; i++)
	{
		DrawItem(context, canvas, sceneitems[i]);
	}
}

//Draws an individual item to the context
// context = context for drawing
// canvas = canvas for measuring
// item = ImageItem, VectorList Item, or SceneObject item
//*****
// NOTE: Text can only be drawn as part of a vector item list
//*****
function DrawItem(context, canvas, item)
{
	//StartContextRotate(context, canvas, item);

	if (item.type == "image")
	{
		DrawImage(context, canvas, item);
	}
	else if (item.type == "vectorlist")
	{
		DrawVectorList(context, canvas, item);
	}
	else if (item.type === "text")
	{
		DrawText(context, canvas, item);
	}
	else if (item.type == "animated")
	{
		DrawAnimatedItem(context, canvas, item);
	}
	else if (item.type == "sceneobject")
	{
		//sanity check to prevent recursive calls
		if (item.renderitem.type == "sceneobject")
			return;
	
		//update position of item actually being rendered
		item.renderitem.x = item.x;
		item.renderitem.y = item.y;
		item.renderitem.rotation = item.rotation;
		item.renderitem.invertX = item.invertX;
		item.renderitem.invertY = item.invertY;
		//recursively call the drawing function to render the item.
		DrawItem(context, canvas, item.renderitem);
		
		//collision debug
		if (PhysicsGlobals.IsDebug)
		{
			if (item.collision != null)
			{
				DrawCollisionDebug(context, canvas, item);
			}
		}
	}
	
	//if type property is invalid or empty, then no action is taken
	
	//EndContextRotate(context, item);
}

//Draws an individual Animated Item to the context
// context = context for drawing
// canvas = canvas object for measuring
// item = Animated Item object
function DrawAnimatedItem(context, canvas, item)
{
	item.UpdateFrameTime(SceneGlobals.RENDER_TIMEOUT);
	var frameitem = item.frames[item.currentframe];
	
	//sanity to prevent recursive calls
	if (frameitem.type == "animated")
		return;
	
	//copy values into target item
	frameitem.x = item.x;
	frameitem.y = item.y;
	frameitem.rotation = item.rotation;
	frameitem.invertX = item.invertX;
	frameitem.invertY = item.invertY;

	//draw target item
	DrawItem(context, canvas, frameitem);
}

//Draws an individual image to the context
// context = context for drawing
// canvas = canvas object for measuring
// item = ImageItem object
function DrawImage(context, canvas, item)
{
	context.save();
	invertandtranslatecontext(context, canvas, item, item.x, item.y);

	if (item.rotation != 0)
	{
		var rotationrad = UnitConverter.DegreesToRadians(item.rotation);
		context.rotate(rotationrad);
	}
	context.drawImage(item.image, 0, 0);
	
	//restore translation
	context.restore();
	context.translate(0,0);
	//restore invert
	context.restore();
}

//Draw a single vector item from a list, assuming that translation and context saving has already been done in DrawVectorList.
// Warning: Only call this function from DrawVectorList or a recursive DrawVectorListItem to render a vector list
// context = drawing context
// canvas = canvas for measuring
// listobjects = VectorListItem object
// item = current item being rendered
// halfwidth = calculated center x of parent
// halfheight = calculated center y of parent
function DrawVectorListItem(context, canvas, listobject, item, halfwidth, halfheight)
{
	context.save();

	if (item.type == "line")
	{
		context.strokeStyle = item.fillstyle;
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(item.left - halfwidth, item.top - halfheight);
		context.lineTo(item.right - halfwidth, item.bottom - halfheight);
		context.stroke();
	}
	else if (item.type == "circle")
	{
		context.beginPath();
		context.arc(item.left + item.right - halfwidth, item.top + item.right - halfheight, item.right,0,Math.PI*2,true);
		context.closePath();	
		context.fill();
	}
	else if (item.type == "rectangle")
	{
		context.fillStyle = item.fillstyle;
		context.fillRect(item.left - halfwidth, item.top - halfheight, item.right, item.bottom);
	}
	else if (item.type == "text")
	{
		DrawText(context, canvas, item, -(halfwidth), -(halfheight));
	}
	else if (item.type == "animated")
	{
		DrawAnimatedItem(context, canvas, item);
	}
	else if (item.type == "vectorlist")
	{
		//save invert
		context.save();
		var itemhalfwidth = 0;//item.GetWidth() / 2;
		var itemhalfheight = 0;//item.GetHeight() / 2;
		invertandtranslatecontext(context, canvas, item, item.x + halfwidth, item.y + halfheight);

		var itemlist = item.vectoritems;
		for (var i = 0; i < itemlist.length; i++)
		{			
			var listItem = item.vectoritems[i];
			DrawVectorListItem(context, canvas, item, listItem, itemhalfwidth, itemhalfheight);
		}
		//revert translate
		context.restore();
		context.translate(0,0);
		//revert invert
		context.restore();
	}
	
	//if type does not match, do nothing
	context.restore();
}

//Draw a sequence of vector operations
// context = drawing context
// canvas = canvas for measuring
// listobjects = VectorListItem object
function DrawVectorList(context, canvas, listobject)
{
	//save invert
	context.save();
	var halfwidth = listobject.GetWidth() / 2;
	var halfheight = listobject.GetHeight() / 2;
	invertandtranslatecontext(context, canvas, listobject, listobject.x + halfwidth, listobject.y + halfheight);
	
	if (listobject.rotation != 0)
	{
		var rotationrad = UnitConverter.DegreesToRadians(listobject.rotation);
		context.rotate(rotationrad);
	}
	
	var itemlist = listobject.vectoritems;
	for (var i = 0; i < itemlist.length; i++)
	{
		var item = itemlist[i];
		DrawVectorListItem(context, canvas, listobject, item, halfwidth, halfheight);
	}
	
	//restore translation
	context.restore();
	context.translate(0,0);
	//restore invert
	context.restore();
}

function DrawText(context, canvas, item, offsetx = 0, offsety = 0)
{
	context.save();
	context.fillStyle = item.fillstyle;
	context.font = item.font;
	context.fillText(item.content, item.x + offsetx, item.y + offsety);
	context.restore();
}

function DrawCollisionDebug(context, canvas, item)
{
	context.strokeStyle = "#40E0D0";
	context.lineWidth = 5;
	context.beginPath();
	context.moveTo(item.x + item.collision.left, item.y + item.collision.top);
	context.lineTo(item.x + item.collision.right, item.y + item.collision.top);
	context.lineTo(item.x + item.collision.right, item.y + item.collision.bottom);
	context.lineTo(item.x + item.collision.left, item.y + item.collision.bottom);
	context.lineTo(item.x + item.collision.left, item.y + item.collision.top);
	context.stroke();
}