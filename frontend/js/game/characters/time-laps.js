export function timeLaps(Game)
{
	Game.originalBallVelocityX = Game.ballVelocity.x;
	if (Game.ball.position.x < 19 && Game.ball.position.x >= 0 && Game.directionPower == "right" && Game.powerPlayer1 == "active")
	{
		Game.powerPlayer1 = "disactive";
		Game.ballVelocity.x = -0.1;
	}
	else if (Game.ball.position.x > -19 && Game.ball.position.x <= 0 && Game.directionPower == "left" && Game.powerPlayer2 == "active")
	{
		Game.powerPlayer2 = "disactive";
		Game.ballVelocity.x = 0.1;
	}
}