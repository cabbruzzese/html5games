//Create handle to canvas object
var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");

function assets () {
    this.BACKGROUND_WIDTH = c.width;
    this.BACKGROUND_HEIGHT = c.height;

    var backgroundrec1 = new VectorItem("rectangle", "#227730",	0, 0, this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);
    this.BACKGROUND = new SceneObject("backgroundobject", 0, 0, new VectorListItem(0, 0, [backgroundrec1]));

    var headsize = 24;
    var torsowidth = 80;
    var torsoheight = 30; 
    var playerheadcirc1 = new VectorItem("circle", "#000000", torsowidth / 2 - headsize / 2, torsoheight / 2 - headsize / 2, headsize / 2, 0);
    var playershouldersrec1 = new VectorItem("rectangle", "#0000FF", 0, 0, torsowidth, torsoheight);
    this.PLAYER_TORSO = new VectorListItem(0, 0, [playershouldersrec1, playerheadcirc1]);

    var legwidth = 24;
    var legheight = 32;
    var legunitsize = 10;
    var legunitsleft = 2;
    var legunitsright = 8;
    var legpantscolor = "#FF0000";
    var leftlegpos = 0;//(torsowidth / legunitsize) * legunitsleft;
    var rightlegpos = 26;//(torsowidth / legunitsize) * legunitsright;
    var legyoffset = torsoheight / 2;
    var legstanding1_1 = new VectorItem("rectangle", legpantscolor, leftlegpos, legyoffset, legwidth, legheight);
    var legstanding1_2 = new VectorItem("rectangle", legpantscolor, rightlegpos, legyoffset, legwidth, legheight);
    var legstanding1 = new VectorListItem(0, 0, [legstanding1_1, legstanding1_2]);
    var legrunning1_1 = new VectorItem("rectangle", legpantscolor, leftlegpos, -(legheight * 2), legwidth, legheight * 2);
    var legrunning1_2 = new VectorItem("rectangle", legpantscolor, rightlegpos, legyoffset, legwidth, legheight * 2);
    var legrunning1 = new VectorListItem(0, 0, [legrunning1_1, legrunning1_2]);
    var legrunning2_1 = new VectorItem("rectangle", legpantscolor, leftlegpos, -(legheight * 3), legwidth, legheight * 3);
    var legrunning2_2 = new VectorItem("rectangle", legpantscolor, rightlegpos, legyoffset, legwidth, legheight * 3);
    var legrunning2 = new VectorListItem(0, 0, [legrunning2_1, legrunning2_2]);
    var legrunning3_1 = new VectorItem("rectangle", legpantscolor, leftlegpos, -(legheight * 2), legwidth, legheight * 2);
    var legrunning3_2 = new VectorItem("rectangle", legpantscolor, rightlegpos, legyoffset, legwidth, legheight * 2);
    var legrunning3 = new VectorListItem(0, 0, [legrunning3_1, legrunning3_2]);
    var legrunning4_1 = legstanding1_1.Clone();
    var legrunning4_2 = legstanding1_2.Clone();
    var legrunning4 = new VectorListItem(0, 0, [legrunning4_1, legrunning4_2]);
    var legrunning5_1 = new VectorItem("rectangle", legpantscolor, leftlegpos, legyoffset, legwidth, legheight * 2);
    var legrunning5_2 = new VectorItem("rectangle", legpantscolor, rightlegpos, -(legheight * 2), legwidth, legheight * 2);
    var legrunning5 = new VectorListItem(0, 0, [legrunning5_1, legrunning5_2]);
    var legrunning6_1 = new VectorItem("rectangle", legpantscolor, leftlegpos, legyoffset, legwidth, legheight * 3);
    var legrunning6_2 = new VectorItem("rectangle", legpantscolor, rightlegpos, -(legheight * 3), legwidth, legheight * 3);
    var legrunning6 = new VectorListItem(0, 0, [legrunning6_1, legrunning6_2]);
    var legrunning7_1 = new VectorItem("rectangle", legpantscolor, leftlegpos, legyoffset, legwidth, legheight * 2);
    var legrunning7_2 = new VectorItem("rectangle", legpantscolor, rightlegpos, -(legheight * 2), legwidth, legheight * 2);
    var legrunning7 = new VectorListItem(0, 0, [legrunning7_1, legrunning7_2]);
    var legrunning8_1 = legstanding1_1.Clone();
    var legrunning8_2 = legstanding1_2.Clone();
    var legrunning8 = new VectorListItem(0, 0, [legrunning8_1, legrunning8_2]);
    var standing_anim = [legstanding1];
    var running_anim = [legrunning1, legrunning2, legrunning3, legrunning4, legrunning5, legrunning6, legrunning7, legrunning8];
    this.PLAYER_LEGS_STANDING = new VectorListItem(0, 0, [legstanding1_1, legstanding1_2]);
    this.PLAYER_LEGS_RUNNING = new AnimatedItem(0, 0, running_anim, 99, -1, null, null);
    this.PLAYER_LEGS = new VectorListItem(0, 0, [this.PLAYER_LEGS_RUNNING]);

    this.PLAYER = new VectorListItem(0, 0, [this.PLAYER_LEGS, this.PLAYER_TORSO]);
}
var ASSETS = new assets();