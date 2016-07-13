//--------------------
//Global Values
//--------------------
var PhysicsGlobals = new function()
{
	this.IsDebug = false;
	this.StandingSnap = 3;
	this.WallSnap = 1;
	this.gravityaccel = 2;
	this.airfriction = 0.90;
	this.friction = 0.15;
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
	
	this.accel = 0.35;
	this.accelsnap = 0.25;
	this.movesnap = 0.5;
	this.maxspeed = 10;
	this.targetspeedx = 0;
	this.curspeedx = 0;
	this.targetspeedy = 0;
	this.curspeedy = 0;
	this.onground = false;
	this.lastx = 0;
	this.lasty = 0;
	this.canapplygravity = true;
	this.terminalvelocity = 30;
	this.gravitymodifier = 1;
	this.selfpropelled = false; //don't apply friction/decay

	this.ApplyGravity = function()
	{
		if (this.onground == false)
		{
			this.targetspeedy += (PhysicsGlobals.gravityaccel * this.gravitymodifier);
			if (this.targetspeedy > this.terminalvelocity)
				this.targetspeedy = this.terminalvelocity;
		}
	}
	
	this.UpdatePosition = function(sceneobject)
	{
		//adjust actual speed to match target
		var speeddiff = this.targetspeedx - this.curspeedx;
		if (speeddiff != 0)
		{
			var absolutespeeddiff = speeddiff;
			if (absolutespeeddiff < 0)
			{
				absolutespeeddiff *= -1;
			}
			//check if accel is within snapping
			if (absolutespeeddiff < this.accelsnap)
			{
				this.curspeedx = this.targetspeedx;
			}
			//otherwise accelerate slowly
			else
			{
				this.curspeedx += speeddiff * this.accel;
			}
		}
		speeddiff = this.targetspeedy - this.curspeedy;
		if (speeddiff != 0)
		{
			var absolutespeeddiff = speeddiff;
			if (absolutespeeddiff < 0)
			{
				absolutespeeddiff *= -1;
			}
			//check if accel is within snapping
			if (absolutespeeddiff < this.accelsnap)
			{
				this.curspeedy = this.targetspeedy;
			}
			//otherwise accelerate slowly
			else
			{
				this.curspeedy += speeddiff * this.accel;
			}
		}
		
		//update postion
		if (sceneobject != null)
		{
			this.lastx = sceneobject.x;
			this.lasty = sceneobject.y;
			sceneobject.x += this.curspeedx;
			sceneobject.y += this.curspeedy;
		}
		
		//decay speeds with friction	
		if (this.targetspeedx != 0 && this.selfpropelled == false)
		{
			//ground friction
			var frictionvalue = PhysicsGlobals.friction;
			//if target is not ground
			if (this.canapplygravity && this.onground == false)
			{
				//so use air friction
				frictionvalue = PhysicsGlobals.airfriction;
			}
			this.targetspeedx *= frictionvalue;
			
			//snap to 0
			var absoluteval = this.targetspeedx;
			if (absoluteval < 0)
				absoluteval *= -1;				
			if (absoluteval < this.movesnap)
				this.targetspeedx = 0;
		}
		//decay y speed
		// if gravity is not enabled
		if (this.canapplygravity == false && this.targetspeedy != 0 && this.selfpropelled == false)
		{
			//apply ground friction
			this.targetspeedy *= PhysicsGlobals.friction;
			
			//snap to 0
			var absoluteval = this.targetspeedy;
			if (absoluteval < 0)
				absoluteval *= -1;				
			if (absoluteval < this.movesnap)
				this.targetspeedy = 0;
		}
		
		if (this.canapplygravity)
		{
			this.ApplyGravity();
		}
	}
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
				
				//if object1 has a callback
				if (tempsceneobject.collision.callback != null)
					//execute
					tempsceneobject.collision.callback(tempsceneobject, targetsceneobject);
				
				//if object2 has a callback
				if (targetsceneobject.collision.callback != null)
					//execute
					targetsceneobject.collision.callback(targetsceneobject, tempsceneobject);
			}
		}
	}
}

function SolidCollide(staticobj, mover)
{
	//if top (including a buffer of 3 pixels) is lower than the bottom of the player
	if (staticobj.y + staticobj.collision.top + PhysicsGlobals.StandingSnap >= mover.collision.lasty + mover.collision.bottom)
	{
		//player is standing on it
		mover.collision.onground = true;
		mover.collision.targetspeedy = 0;
		mover.collision.curspeedy = 0;
		mover.y = (staticobj.y - mover.collision.bottom);
	}
	else if (staticobj.y + staticobj.collision.bottom - PhysicsGlobals.StandingSnap <= mover.collision.lasty + mover.collision.top)
	{
		//stop movement
		mover.collision.targetspeedy = 1;
		mover.collision.curspeedy = 1;
		mover.y = (staticobj.y + staticobj.collision.bottom);
	}
	else
	{
		//stop movement
		//playertargetspeedx = 0;
		
		//on the right side
		if (mover.x + mover.collision.left > staticobj.x + staticobj.collision.left + (staticobj.collision.right / 2))
		{
			mover.x = staticobj.x + mover.collision.right + PhysicsGlobals.WallSnap;
		}
		//on the left side
		else if (mover.x + mover.collision.right < staticobj.x + staticobj.collision.left + (staticobj.collision.right / 2))
		{
			mover.x = staticobj.x - mover.collision.right - PhysicsGlobals.WallSnap;
		}			
	}
}