
export function movePaddlesComputer(Game)
{
	// Déplacement des raquettes
	if (Game.keys['w'] && Game.changeCamera == 0) Game.leftPaddle.position.y += Game.paddleSpeed; // Up
	if (Game.keys['a'] && Game.changeCamera > 0) Game.leftPaddle.position.y += Game.paddleSpeed; //left
	if (Game.keys['s'] && Game.changeCamera == 0) Game.leftPaddle.position.y -= Game.paddleSpeed; // Down
	if (Game.keys['d'] && Game.changeCamera > 0) Game.leftPaddle.position.y -= Game.paddleSpeed; // right
	if (Game.keys['ArrowUp'] && Game.changeCamera == 0) Game.rightPaddle.position.y += Game.paddleSpeed; // Up
	if (Game.keys['ArrowLeft'] && Game.changeCamera > 0) Game.rightPaddle.position.y -= Game.paddleSpeed; // Left
	if (Game.keys['ArrowRight'] && Game.changeCamera > 0) Game.rightPaddle.position.y += Game.paddleSpeed; // Right
	if (Game.keys['ArrowDown'] && Game.changeCamera == 0) Game.rightPaddle.position.y -= Game.paddleSpeed; // Down
}