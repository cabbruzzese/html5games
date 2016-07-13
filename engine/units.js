var UnitConverter = new function()
{
	//Converts Degrees to Radians
	// deg = degrees to convert
	//Returns: radians as a floating point number
	this.DegreesToRadians = function(deg)
	{
		var answer = deg * (Math.PI / 180);
		return answer;
	}

	//Converts Radians to Degrees
	// rad = radians to convert
	//Returns: degrees as a floating point number
	this.RadiansToDegrees = function(rad)
	{
		var answer = rad * (180 / Math.PI);
		return answer;
	}
};