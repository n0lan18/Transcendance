export function invisible(Game, player)
{
	if (Game.ball.position.x > -23 && player == "left")
	{
		Game.ball.visible = false;
		Game.trail.visible = false;
		console.log("invisible");
	}
	else if (Game.ball.position.x < 23 && player == "right")
	{
		Game.ball.visible = false;
		Game.trail.visible = false;
		console.log("invisible");	
	}
}