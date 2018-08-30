//function to clone an existing array
// array = instance of an array
// Returns: a new array containing the same elements 
//  Note: (existing object pointers are kept, does not attempt to clone array items)
function CloneArray(array)
{
	var answer = new Array();
	for (var i = 0; i < array.length; i++)
	{
		answer[i] = array[i];
	}
	
	return answer;
}

//function to join two arrays into a new array object
// array1 = array to include first
// array2 = array to include second
// Returns: A new array containing all of the elements from the first 2
function JoinArray(array1, array2)
{
	var answer = new Array();
	var i;
	for (i = 0; i < array1.length; i++)
	{
		answer.push(array1[i]);
	}
	for (i = 0; i < array2.length; i++)
	{
		answer.push(array2[i]);
	}
	return answer;
}

//function to get index of item in array by name property
// array = instance of an array 
// name = string to find
// Returns: integer index or -1 if not found
// **Note
//    All items in array must have .name property
function ArrayFindIndexByName(array, name)
{
	for (var arrayindex = 0; arrayindex < array.length; arrayindex++)
	{
		if (array[arrayindex].name == name)
		{
			return arrayindex;
		}
	}
	
	return -1;
}

//function to remove an index from the array and move all items up
// array = instance of an array
// removeindex = index to remove
function ArrayRemoveIndex(array, removeindex)
{
	//bubble sort, overwritting unwanted element then trim array length by 1 removing last element
	
	//start at removeindex and cycle through all but last element	
	for (var arrayindex = removeindex; arrayindex < array.length - 1; arrayindex++)
	{
		//replace current element with next element 
		array[arrayindex] = array[arrayindex + 1];
	}
	
	//change length (effectively removing last element)
	array.length = array.length - 1;
}

//Cycles through array looking for matching item
// array = target array
// item = instance of item to find
//Returns: index of item if found or -1 if not found
function ArrayFindIndexByItem(array, item)
{
	for (var arrayindex = 0; arrayindex < array.length; arrayindex++)
	{
		if (array[arrayindex] == item)
		{
			return arrayindex;
		}
	}
	
	return -1;
}

//Finds item by index and removes from the array
// array = target array
// item = item to remove
//Returns: true if item found and then removed. False if item not found
function ArrayRemoveItem(array, item)
{
	var targetindex = ArrayFindIndexByItem(array, item);
	
	//if item not found, return false
	if (targetindex == -1)
		return false;

	ArrayRemoveIndex(array, targetindex);
	return true;
}