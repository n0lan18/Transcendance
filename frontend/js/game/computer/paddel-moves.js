
export function movePaddlesComputer(Game)
{
	// Déplacement des raquettes
	if ((Game.keys['w'] || Game.keys['W']) && Game.changeCamera == 0) Game.leftPaddle.position.y += Game.paddleSpeed; // Up
	if ((Game.keys['a'] || Game.keys['A']) && Game.changeCamera > 0) Game.leftPaddle.position.y += Game.paddleSpeed; //left
	if ((Game.keys['s'] || Game.keys['S'] ) && Game.changeCamera == 0) Game.leftPaddle.position.y -= Game.paddleSpeed; // Down
	if ((Game.keys['d'] || Game.keys['D']) && Game.changeCamera > 0) Game.leftPaddle.position.y -= Game.paddleSpeed; // right
	if (Game.typeOfGame == "multiplayer")
	{
		if (Game.keys['ArrowUp'] && Game.changeCamera == 0) Game.rightPaddle.position.y += Game.paddleSpeed; // Up
		if (Game.keys['ArrowLeft'] && Game.changeCamera > 0) Game.rightPaddle.position.y -= Game.paddleSpeed; // Left
		if (Game.keys['ArrowRight'] && Game.changeCamera > 0) Game.rightPaddle.position.y += Game.paddleSpeed; // Right
		if (Game.keys['ArrowDown'] && Game.changeCamera == 0) Game.rightPaddle.position.y -= Game.paddleSpeed; // Down

		if (Game.modeGame == "multiPlayerFour")
		{
			if (Game.keys['8'] && Game.changeCamera == 0) Game.rightPaddleMini.position.y += Game.paddleSpeed; // Up
			if (Game.keys['4'] && Game.changeCamera > 0) Game.rightPaddleMini.position.y -= Game.paddleSpeed; // Left
			if (Game.keys['6'] && Game.changeCamera > 0) Game.rightPaddleMini.position.y += Game.paddleSpeed; // Right
			if (Game.keys['2'] && Game.changeCamera == 0) Game.rightPaddleMini.position.y -= Game.paddleSpeed; // Down

			if ((Game.keys['i'] || Game.keys['I']) && Game.changeCamera == 0) Game.leftPaddleMini.position.y += Game.paddleSpeed; // Up
			if ((Game.keys['j'] || Game.keys['J']) && Game.changeCamera > 0) Game.leftPaddleMini.position.y += Game.paddleSpeed; //left
			if ((Game.keys['m'] || Game.keys['M'] ) && Game.changeCamera == 0) Game.leftPaddleMini.position.y -= Game.paddleSpeed; // Down
			if ((Game.keys['l'] || Game.keys['L']) && Game.changeCamera > 0) Game.leftPaddleMini.position.y -= Game.paddleSpeed; // right
		}
	}
}