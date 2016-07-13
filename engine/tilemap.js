var TileGlobals = new function()
{
	//types of tiles
	this.TileType_Block = "block";

	//parsing information
	this.TileMap_NAME = "tilemap";
	this.TileMap_scenename_ATTR = "scenename";
	this.TileMap_tilewidth_ATTR = "tilewidth";
	this.TileMap_tileheight_ATTR = "tileheight";
	this.Tile_NAME = "tile";
	this.VectorList_NAME = "VectorList";
	this.VectorItem_NAME = "VectorItem";
	this.VectorItem_fillstyle_ATTR = "fillstyle";
	this.VectorItem_type_ATTR = "type";
	this.VectorItem_left_ATTR = "left";
	this.VectorItem_top_ATTR = "top";
	this.VectorItem_right_ATTR = "right";
	this.VectorItem_bottom_ATTR = "bottom";
	this.Tile_type_ATTR = "type";
	this.Tile_x_ATTR = "x";
	this.Tile_y_ATTR = "y";
	
	this.BlockCollidedCallback = null;
	
	this.TestXmlText =	"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
						"<level>" +
						"<tilemap scenename=\"gamescreen\" tilewidth=\"64\" tileheight=\"64\">" +
						"<tile type=\"block\" x=\"1\" y=\"1\">" +
						"<VectorList>" +
						"<VectorItem type=\"rectangle\" fillstyle=\"#222222\" left=\"0\" top=\"0\" right=\"64\" bottom=\"64\">" +
						"</VectorItem>" +
						"</VectorList>" +
						"</tile>" +
						"</tilemap>" +
						"</level>";

	this.FetchLevelData = function(filepath)
	{
		requestobj=new XMLHttpRequest();
		requestobj.open("GET",filepath,false);
		requestobj.send();
		var responseobj = requestobj.responseXML;
		return responseobj;
	}
	this.ParseXMLString = function(xmldata)
	{
		var xmlobj = null;
		if (window.DOMParser)
		{
			parser=new DOMParser();
			xmlobj=parser.parseFromString(xmldata,"text/xml");		
		}
		
		if (xmlobj == null)
			return null;
			
		return this.ParseXMLFile(xmlobj);
	}
	this.ParseXMLObject = function(xmlobj)
	{
		if (xmlobj == null)
			return null;
	
		var scenearray = new Array();
		
		//parse any tilemaps
		var tilemaps = xmlobj.getElementsByTagName(this.TileMap_NAME);
		for (var i = 0; i < tilemaps.length; i++)
		{
			var sceneobj = this.ParseTileMap(tilemaps[i]);
			ArrayAddItem(scenearray, sceneobj);
		}
		
		if (scenearray.length == 0)
			return null;
	
		return scenearray;
	}
	
	this.ParseTileMap = function (xmlobj)
	{
		if (xmlobj == null)
			return null;
		
		//parse any tiles
		var tiles = xmlobj.getElementsByTagName(this.Tile_NAME);
		if (tiles.length == 0)
			return null;
		
		var widthval  = parseInt(xmlobj.attributes.getNamedItem(this.TileMap_tilewidth_ATTR).nodeValue);
		var heightval = parseInt(xmlobj.attributes.getNamedItem(this.TileMap_tileheight_ATTR).nodeValue);

		var sceneobjects = new Array();
		for (var i = 0; i < tiles.length; i++)
		{
			var tempsceneobj = this.ParseTile(tiles[i], widthval, heightval);
			if (tempsceneobj != null)
				ArrayAddItem(sceneobjects, tempsceneobj);
		}
		
		if (sceneobjects.length == 0)
			return null;
		
		var scenename =  xmlobj.attributes.getNamedItem(this.TileMap_scenename_ATTR).nodeValue;
		if (scenename == null)
			scenename = "tilemapscene";
			
		var sceneobj = GetScene(scenename);
		sceneobj.items = JoinArray(sceneobj.items, sceneobjects);
		
		return sceneobj;
	}
	
	this.ParseTile = function (xmlobj, tilewidth, tileheight)
	{
		if (xmlobj == null)
			return null;

		if (xmlobj.childNodes.length == 0)
			return null;

		var renderitemnode = null; 
		var i = 0;
		while (renderitemnode == null)
		{
			renderitemnode = xmlobj.childNodes[i];
			if (renderitemnode.nodeName == "#text")
				renderitemnode = null;
			i++;
		}
		var renderitem = this.ParseRenderItem(renderitemnode);
		if (renderitem == null)
			return null;
			
		var xval = parseInt(xmlobj.attributes.getNamedItem(this.Tile_x_ATTR).nodeValue);
		var yval = parseInt(xmlobj.attributes.getNamedItem(this.Tile_y_ATTR).nodeValue);
		var type = xmlobj.attributes.getNamedItem(this.Tile_type_ATTR).nodeValue;

		var tempsceneobj = new SceneObject(type, xval * tilewidth, yval * tileheight, renderitem);
		
		switch(type)
		{
			//requires that onBlockCollided be defined in game code
			case this.TileType_Block:			
				tempsceneobj.collision = new CollisionObject(0, 0, tilewidth, tileheight, this.BlockCollidedCallback);
				break;
		}
		
		return tempsceneobj;
	}
	
	this.ParseRenderItem = function (xmlobj)
	{
		if (xmlobj == null)
			return null;
			
		switch(xmlobj.nodeName)
		{
			case this.VectorList_NAME:
				var vectoritems = new Array;
				for (var i = 0; i < xmlobj.childNodes.length; i++)
				{
					if (xmlobj.childNodes[i].nodeName == "#text")
						continue;
					var vectoritem = this.ParseRenderItem(xmlobj.childNodes[i]);
					if (vectoritem != null)
						ArrayAddItem(vectoritems, vectoritem);			
				}
				
				if (vectoritems.length == 0)
					return null;
					
				var vectorlistitem = new VectorListItem(0, 0, vectoritems);
				return vectorlistitem;
				break;
			case this.VectorItem_NAME:
				var itemtype = xmlobj.attributes.getNamedItem(this.VectorItem_type_ATTR).nodeValue;
				var itemfillstyle = xmlobj.attributes.getNamedItem(this.VectorItem_fillstyle_ATTR).nodeValue;
				var left = xmlobj.attributes.getNamedItem(this.VectorItem_left_ATTR).nodeValue;
				var top = xmlobj.attributes.getNamedItem(this.VectorItem_top_ATTR).nodeValue;
				var right = xmlobj.attributes.getNamedItem(this.VectorItem_right_ATTR).nodeValue;
				var bottom = xmlobj.attributes.getNamedItem(this.VectorItem_bottom_ATTR).nodeValue;
				var vectoritem = new VectorItem (itemtype, itemfillstyle, left, top, right, bottom);
				return vectoritem;
				break;
		}
	}
}