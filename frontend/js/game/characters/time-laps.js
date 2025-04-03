export function timeLaps(Game)
{
	Game.originalBallVelocityX = Game.ballVelocity.x;
	if (Game.ball.position.x < 19 && Game.ball.position.x >= 0 && Game.directionPower == "right" && Game.powerPlayer1 == "active")
	{
		Game.powerPlayer1 = "disactive";
		Game.ballVelocity.x = -0.1;
		if (Game.isplayer1 && Game.modeGame == "Online")	 {
			let message = {
				type: "timelaps",
				player: "player1",
				velocity: Game.ballVelocity.x
			};
			Game.socket.send(JSON.stringify(message));
		}
	}
	else if (Game.ball.position.x > -19 && Game.ball.position.x <= 0 && Game.directionPower == "left" && Game.powerPlayer2 == "active")
	{
		Game.powerPlayer2 = "disactive";
		Game.ballVelocity.x = 0.1;
		if (!Game.isplayer1 && Game.modeGame == "Online")	 {
			let message = {
				type: "timelaps",
				player: "player2",
				velocity: Game.ballVelocity.x
			};
			Game.socket.send(JSON.stringify(message));
		}
	}
}