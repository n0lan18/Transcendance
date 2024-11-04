export function superStrength(Game, player)
{
	if (Game.ball.position.x > -23 && Game.ball.position.x <= 0 && player == "left" && Game.powerPlayer1 == "active")
	{
		Game.powerPlayer1 = "disactive";
		Game.ballVelocity.x = 0.6;

		Game.ballVelocity.y = Math.random() < 0.5 ? 0.25 : -0.25;
	}
	else if (Game.ball.position.x < 23 && Game.ball.position.x >= 0 && player == "right" && Game.powerPlayer2 == "active")
	{
		Game.powerPlayer2 = "disactive";
		Game.ballVelocity.x = -0.6;
		Game.ballVelocity.y = Math.random() < 0.5 ? 0.25 : -0.25;
	}
}