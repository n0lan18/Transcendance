export function timeLaps(Game, player)
{
	console.log("QQQ")
	if (Game.ball.position.x < 19 && player == "left")
	{
		Game.ball.velocity.x = 0.1;
		console.log("TIME LAPS " + Game.ball.velocity.x);
	}
	else if (Game.ball.position.x > -19 && player == "right")
		Game.ball.velocity.x = 0.1;
}