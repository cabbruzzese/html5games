//--------------------
//Global Values
//--------------------
var PhysicsGlobals = new function()
{
	this.IsDebug = false;
}

//--------------------
//Object Constructors
//--------------------
function CollisionObject (left, top, right, bottom, callback)
{
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
	this.enabled = true;
	this.callback = callback;
}

//------------------
//Collision Methods
//------------------

//Checks is an x and y value is inside of scene object's collision
// so = scene object
// x = x of point to check
// y = y of point to check
//Returns: true if point is within so's collision bounds otherwise returns falls
function PointInCollisionObject(so, x, y)
{
	//X value within range
	if (x >= so.x + so.collision.left &&
		x <= so.x + so.collision.right)
	{
		//Y value within range 
		if (y >= so.y + so.collision.top &&
			y <= so.y + so.collision.bottom)
		{
			return true;
		}
	}
	
	return false;
}

//Checks if any point in scene object 2's collision object is inside of scene object 1's colision object 1
// so1 = Source SceneObject instance
// so2 = Target SceneObject instance to check if inside of #1
//Returns: true if any point of so2 is in so1
function CollisionObjectInObject(so1, so2)
{
	
	if (PointInCollisionObject(so1, so2.x + so2.collision.left,  so2.y + so2.collision.top) || //top left corner
	    PointInCollisionObject(so1, so2.x + so2.collision.right, so2.y + so2.collision.top) || //top right corner
		PointInCollisionObject(so1, so2.x + so2.collision.left,  so2.y + so2.collision.bottom) || //bottom left corner
		PointInCollisionObject(so1, so2.x + so2.collision.right, so2.y + so2.collision.bottom))   //bottom right corner
	{
		return true;
	}
	
	return false;		
}

function CheckSceneCollisions(scene)
{
	//cycle through all scene items
	for (var i = 0; i < scene.items.length; i++)
	{
		var tempsceneobject = scene.items[i];
		
		//if object doesn't have collision
		if (tempsceneobject.collision == null)
			continue;
			
		//if object has a callback (objects without callbacks do not need to be run twice)
		if (tempsceneobject.collision.callback != null)
		{
			//cycle through all scene items after position i
			// Note: All scene items before position i have already checked collision
			for (var i2 = i + 1; i2 < scene.items.length; i2++)
			{			
				var targetsceneobject = scene.items[i2];
				
				//if target scene object does not have collision
				if (targetsceneobject.collision == null)
					continue;				
				
				//check if object1 is in object 2 or vice versa
				if (CollisionObjectInObject(tempsceneobject, targetsceneobject) ||
					CollisionObjectInObject(targetsceneobject, tempsceneobject))
				{
					//execute callback for object1
					tempsceneobject.collision.callback(targetsceneobject);
					
					//if object2 has a callback
					if (targetsceneobject.collision.callback != null)
						//execute
						targetsceneobject.collision.callback(tempsceneobject);
				}
			}
		}
	}
}