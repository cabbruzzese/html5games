//Tutorial from:
//http://javascript.about.com/library/bladdjs.htm
function AddReference(filename, elementname) 
{
	var curdoc = document.getElementsByTagName(elementname)[0];
	var newelement = document.createElement('script');
	newelement.setAttribute('type','text/javascript');
	newelement.setAttribute('src',filename);
	curdoc.appendChild(newelement);
}