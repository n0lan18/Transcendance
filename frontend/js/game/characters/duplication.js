export function duplication(Game, player)
{
	if (Game.ball.position.x > -23 && Game.ball.position.x <= 0 && player == "left" && Game.powerPlayer1 == "active")
	{
		Game.powerPlayer1 = "disactive";
		Game.ballReplica = Game.ball.clone();
		Game.ballReplica.position.copy(Game.ball.position);
		Game.scene.add(Game.ballReplica);
		Game.ballVelocityReplica = {
			x: Game.ballVelocity.x,
			y: Game.ballVelocity.y * -1.02
		};	
	}
	else if (Game.ball.position.x < 23 && Game.ball.position.x >= 0 && player == "right" && Game.powerPlayer2 == "active")
	{
		Game.powerPlayer2 = "disactive";
		Game.ballReplica = Game.ball.clone();
		Game.ballReplica.position.copy(Game.ball.position);
		Game.scene.add(Game.ballReplica);
		Game.ballVelocityReplica = {
			x: Game.ballVelocity.x,
			y: Game.ballVelocity.y * -1.02
		};
	}
}