
function MainGame ()
{
	//handle to canvas object

	var c=document.getElementById("myCanvas");

	var cxt=c.getContext("2d");



	//Game State

	var GameState = "loading";



	//Constants

	var PlayerRadius = 15;

	var BulletRadius = 5;

	var BulletSpeed = 20; //note, if speed ever goes above 30, then the bullet can jump over a player on a given frame

	var ArenaTop = 55;

	var ArenaBottom = c.height;

	var ArenaLeft = 0;

	var ArenaRight = c.width;

	var PlayerSpeed = 10;

	//starting positions

	var Player1 = 

	{

		x: ArenaLeft + 40,

		y: ArenaTop + 40,

		Score:0,

		Bullet:

		{

			x:0,

			y:0,

			Velocity:

			{

				x:0,

				y:0

			}

		},

		Direction:"right",

		Shooting:false,

		Dead:false

	}

	var Player2 = 

	{

		x:ArenaRight - 40,

		y:ArenaBottom - 40,

		Score:0,

		Bullet:

		{

			x:0,

			y:0,

			Velocity:

			{

				x:0,

				y:0

			}

		},

		Direction:"left",

		Shooting:false,

		Dead:false

	}



	//load assets

	var totalAssets = 1;

	var currentAssets = 0;

	var skull = new Image();

	skull.onload = function()

	{

		currentAssets = currentAssets + 1;

		CheckAssets();

	}

	skull.src = "killdotimages/skull.png";



	function CheckAssets()

	{

		if (currentAssets == totalAssets)

			StartGame();

	}



	function StartGame()

	{

		StartRound();

	}

	function StartRound()

	{

		GameState = "gamestart";

		//reset all player defaults

		Player1.x = ArenaLeft + 40;

		Player1.y = ArenaTop + 40;

		Player1.Bullet.x = 0;

		Player1.Bullet.y = 0;

		Player1.Bullet.Velocity.x = 0;

		Player1.Bullet.Velocity.y = 0;

		Player1.Direction = "right";

		Player1.Shooting = false;

		Player1.Dead = false;

		Player2.x = ArenaRight - 40;

		Player2.y = ArenaBottom - 40;

		Player2.Bullet.x = 0;

		Player2.Bullet.y = 0;

		Player2.Bullet.Velocity.x = 0;

		Player2.Bullet.Velocity.y = 0;

		Player2.Direction = "left";

		Player2.Shooting = false;

		Player2.Dead = false;

	}



	function KillDot(player)

	{

		player.Shooting = false;

		player.Dead = true;

		GameState = "gameover";

		IgnoreInputTimer = 15;

	}



	//draw scene

	function DrawLoading()

	{

		//background

		cxt.fillStyle="#353535";

		cxt.fillRect(0, 0, c.width, c.height);

		cxt.fillStyle="#DDDDDD";

		cxt.font="24pt Arial";

		cxt.fillText("Loading", 25, 50);

	}

	function DrawScene()

	{

		//background

		cxt.fillStyle="#00FF00";

		cxt.fillRect(0, 0, c.width, c.height);



		//Scoreboard

		cxt.fillStyle="#CC2222";

		cxt.fillRect(0, 0, ArenaRight / 2, ArenaTop);

		cxt.fillStyle="#2222CC";

		cxt.fillRect(ArenaRight / 2, 0, ArenaRight, ArenaTop);

		cxt.font="14pt Arial";

		cxt.fillStyle="#000000";

		cxt.fillRect(0, ArenaTop - 5, ArenaRight, 5);

		cxt.fillText("Scores", 5, 17);

		cxt.font="28pt Arial";

		cxt.fillText(Player1.Score, (ArenaRight/2) - 60, 38);

		cxt.fillText(Player2.Score, ArenaRight - 60, 38);



		//players

		cxt.fillStyle="#FF0000";

		cxt.beginPath();

		cxt.arc(Player1.x,Player1.y,PlayerRadius,0,Math.PI*2,true);

		cxt.closePath();	



		cxt.fill();

		cxt.fillStyle="#0000FF";

		cxt.beginPath();

		cxt.arc(Player2.x,Player2.y,PlayerRadius,0,Math.PI*2,true);

		cxt.closePath();

		cxt.fill();



		if (Player1.Dead)

		{

			cxt.drawImage(skull,Player1.x - PlayerRadius,Player1.y - PlayerRadius);

			cxt.fillStyle="#000000";

			cxt.font="36pt Arial";

			cxt.fillText("Player 2 Wins!", 100, (ArenaBottom / 2) - 36);

			cxt.font="24pt Arial";

			cxt.fillText("Press Any Key To Continue...", 40, (ArenaBottom / 2) + 15);

		}

		if (Player2.Dead)

		{

			cxt.drawImage(skull,Player2.x - PlayerRadius,Player2.y - PlayerRadius);

			cxt.fillStyle="#000000";

			cxt.font="36pt Arial";

			cxt.fillText("Player 1 Wins!", 100, (ArenaBottom / 2) - 36);

			cxt.font="24pt Arial";

			cxt.fillText("Press Any Key To Continue...", 40, (ArenaBottom / 2) + 15);

		}

		

		//bullets

		if (Player1.Shooting)

		{

			cxt.fillStyle="#DD2222";

			cxt.beginPath();

			cxt.arc(Player1.Bullet.x,Player1.Bullet.y,BulletRadius,0,Math.PI*2,true);

			cxt.closePath();

			cxt.fill();

		}

		if (Player2.Shooting)

		{

			cxt.fillStyle="#2222DD";

			cxt.beginPath();

			cxt.arc(Player2.Bullet.x,Player2.Bullet.y,BulletRadius,0,Math.PI*2,true);

			cxt.closePath();

			cxt.fill();

		}

	}



	function PointInObject(xpos, ypos, object1, object1bounds)

	{

		//point is less than right side and greater than left side

		if (xpos <= object1.x + object1bounds &&

			xpos >= object1.x - object1bounds)

		{

			//point is less than bottom side and greater than top side

			if (ypos <= object1.y + object1bounds &&

				ypos >= object1.y - object1bounds)

				return true;

		}

		

		return false;

	}

	function CheckCollision(object1, object2, object1bounds, object2bounds, xvel, yvel)

	{

		//object 1 in object 2

		var newx = object1.x + xvel;

		var newy = object1.y + yvel;

		//check center, left-top, left-bottom, right-top, right-bottom

		if (PointInObject(newx, newy, object2, object2bounds) ||

			PointInObject(newx - object1bounds, newy - object1bounds, object2, object2bounds) ||

			PointInObject(newx - object1bounds, newy + object1bounds, object2, object2bounds) ||

			PointInObject(newx + object1bounds, newy - object1bounds, object2, object2bounds) ||

			PointInObject(newx + object1bounds, newy + object1bounds, object2, object2bounds))

			return true;

		

		//object 2 in object 1

		//create temp object at new position for boundary test

		var temp1 = { x:newx, y:newy }

		//check center, left-top, left-bottom, right-top, right-bottom

		if (PointInObject(object2.x, object2.y, object1, object1bounds) ||

			PointInObject(object2.x - object2bounds, object2.y - object2bounds, temp1, object1bounds) ||

			PointInObject(object2.x - object2bounds, object2.y + object2bounds, temp1, object1bounds) ||

			PointInObject(object2.x + object2bounds, object2.y - object2bounds, temp1, object1bounds) ||

			PointInObject(object2.x + object2bounds, object2.y + object2bounds, temp1, object1bounds))

			return true;

		

		return false;

	}

	function CheckBoundary(object, radius, xvel, yvel)

	{

		//upper and lower boundaries

		if ((object.y + yvel) < (ArenaTop + radius) ||

			(object.y + yvel) > (ArenaBottom - radius))

			return true;

			

		//side boundaries

		if ((object.x + xvel) < (ArenaLeft + radius) ||

			(object.x + xvel) > (ArenaRight - radius))

			return true;

			

		return false;

	}

	function MovePlayer1(xvel, yvel, direction)

	{

		//face player

		Player1.Direction = direction;

		

		//make sure players don't collide

		if (CheckCollision(Player1, Player2, PlayerRadius, PlayerRadius, xvel, yvel))

			return;

		MovePlayer(Player1, xvel, yvel);

	}

	function MovePlayer2(xvel, yvel, direction)

	{

		//face player

		Player2.Direction = direction;

		

		//make sure players don't collide

		if (CheckCollision(Player2, Player1, PlayerRadius, PlayerRadius, xvel, yvel))

			return;

		MovePlayer(Player2, xvel, yvel);

	}



	function MovePlayer(player, xvel, yvel)

	{

		//make sure that move doesn't put player out of bounds

		if (CheckBoundary(player, PlayerRadius, xvel, yvel))

			return;



		//move player

		player.x = player.x + xvel;

		player.y = player.y + yvel;

	}



	var IgnoreInputTimer = 0;

	var leftarrow = 37;

	var uparrow = 38;

	var rightarrow = 39;

	var downarrow = 40;

	var keya = 65;

	var keyw = 87;

	var keys = 83;

	var keyd = 68;

	var keyrctrl = 70;

	var keyboardslash = 191;

	document.onkeyup = function(event)

	{

		//if timer is set, ignore any inputs

		if (IgnoreInputTimer > 0)

			return;



		//Only get commands while game is running

		var key = event.keyCode;

		//document.write(key);

		if (GameState == "gameover")

		{

			StartRound();

		}

		if (GameState != "gamestart")

			return;

		



		if (key == keyw) { MovePlayer1(0, PlayerSpeed * -1, "up"); }

		if (key == keys) { MovePlayer1(0, PlayerSpeed, "down"); }

		if (key == keyd) { MovePlayer1(PlayerSpeed, 0, "right"); }

		if (key == keya) { MovePlayer1(PlayerSpeed * - 1, 0, "left"); }



		if (key == uparrow) 	{ MovePlayer2(0, PlayerSpeed * -1, "up"); }

		if (key == downarrow) 	{ MovePlayer2(0, PlayerSpeed, "down"); }

		if (key == rightarrow) 	{ MovePlayer2(PlayerSpeed, 0, "right"); }

		if (key == leftarrow) 	{ MovePlayer2(PlayerSpeed * -1, 0, "left"); }



		if (key == keyrctrl) 	{ FireBullet(Player1); }

		if (key == keyboardslash) 	{ FireBullet(Player2); }

	}



	function FireBullet(player)

	{

		if (player.Shooting)

			return;

			

		var xvel = 0;

		var yvel = 0;

		if (player.Direction == "up")

		{

			yvel = BulletSpeed * -1;

		}

		else if (player.Direction == "down")

		{

			yvel = BulletSpeed;

		}

		else if (player.Direction == "left")

		{

			xvel = BulletSpeed * -1;

		}

		else if (player.Direction == "right")

		{

			xvel = BulletSpeed;

		}

		player.Bullet.x = player.x;

		player.Bullet.y = player.y;

		player.Bullet.Velocity.x = xvel;

		player.Bullet.Velocity.y = yvel;

		player.Shooting = true;

	}

	function RemoveBullet (player)

	{

		player.Bullet.Velocity.x = 0;

		player.Bullet.Velocity.y = 0;

		player.Shooting = false;

	}

	function UpdateBullet (player)

	{

		if (CheckBoundary(player.Bullet, BulletRadius, player.Bullet.Velocity.x, player.Bullet.Velocity.y))

		{

			RemoveBullet(player);

			return;

		}



		player.Bullet.x = player.Bullet.x + player.Bullet.Velocity.x;

		player.Bullet.y = player.Bullet.y + player.Bullet.Velocity.y;

	}

	function UpdateBullets()

	{

		//Player 1 - If shooting

		if (Player1.Shooting)

		{

			//Update bullet position (and remove if past boundary)

			UpdateBullet(Player1);

			//check if hit player 2

			if (CheckCollision(Player1.Bullet, Player2, BulletRadius, PlayerRadius, 0, 0))

			{

				Player1.Shooting = false;

				Player2.Shooting = false;

				//kill player 2 and dump from function

				KillDot(Player2);

				//update scores

				Player1.Score = Player1.Score + 1;

				return;

			}

		}



		//Player 2 - If shooting

		if (Player2.Shooting)

		{

			//Update bullet position (and remove if past boundary)

			UpdateBullet(Player2);

			//check if hit player 1

			if (CheckCollision(Player2.Bullet, Player1, BulletRadius, PlayerRadius, 0, 0))

			{

				Player1.Shooting = false;

				Player2.Shooting = false;

				//kill player 1

				KillDot(Player1);

				//update scores

				Player2.Score = Player2.Score + 1;

			}

		}

	}



	//Set up game loop

	setInterval(mainLoop, 33);

	function mainLoop()

	{

		//decrement input timer every frame

		if (IgnoreInputTimer > 0)

			IgnoreInputTimer = IgnoreInputTimer - 1;



		if (GameState == "gamestart")

		{

			UpdateBullets();

			DrawScene();

		}

		else if (GameState == "loading")

		{

			DrawLoading();

		}

	}
}



MainGame();