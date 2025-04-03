export function invisible(Game, player)
{
	if (Game.ball.position.x > -23 && Game.ball.position.x < 19 && player == "left" && Game.powerPlayer1 == "active")
	{
		Game.ball.visible = false;
		Game.scene.remove(Game.trail);
		if (Game.isplayer1 && Game.modeGame == "Online" && Game.wbsckt == 0)	 {
			Game.wbsckt++; 
			let message = {
				type: "invisibility",
				player: "player1",
				visibility: Game.ball.visible,
				trail: "delete"
			};
			Game.socket.send(JSON.stringify(message));
		}
	}
	else if (Game.ball.position.x < 23 && Game.ball.position.x > -19  && player == "right" && Game.powerPlayer2 == "active")
	{
		Game.ball.visible = false;
		Game.scene.remove(Game.trail);
		if (!Game.isplayer1 && Game.modeGame == "Online" && Game.wbsckt == 0)	 {
			Game.wbsckt++;  
			let message = {
				type: "invisibility",
				player: "player2",
				visibility: Game.ball.visible,
				trail: "delete"
			};
			Game.socket.send(JSON.stringify(message));
		}
	}
	else
	{
		Game.wbsckt = 0;
		if (player == "left")
			Game.powerPlayer1 = "disactive";
		else
			Game.powerPlayer2 = "disactive";
		Game.ball.visible = true;
	}
}