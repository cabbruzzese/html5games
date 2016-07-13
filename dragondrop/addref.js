//Tutorial from:
//http://javascript.about.com/library/bladdjs.htm
function addJavascript(jsname,pos) 
{
	var curdoc = document.getElementsByTagName(pos)[0];
	var curele = document.createElement('script');
	curele.setAttribute('type','text/javascript');
	curele.setAttribute('src',jsname);
	curdoc.appendChild(s);
}