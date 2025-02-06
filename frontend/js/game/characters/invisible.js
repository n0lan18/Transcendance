export function invisible(Game, player)
{
	if (Game.ball.position.x > -23 && Game.ball.position.x < 19 && player == "left" && Game.powerPlayer1 == "active")
	{
		Game.ball.visible = false;
		Game.scene.remove(Game.trail);
	}
	else if (Game.ball.position.x < 23 && Game.ball.position.x > -19  && player == "right" && Game.powerPlayer2 == "active")
	{
		Game.ball.visible = false;
		Game.scene.remove(Game.trail);
	}
	else
	{
		if (player == "left")
			Game.powerPlayer1 = "disactive";
		else
			Game.powerPlayer2 = "disactive";
		Game.ball.visible = true;
	}
}