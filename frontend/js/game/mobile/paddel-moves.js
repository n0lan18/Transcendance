
export function paddleMovesMobile(Game)
{
	let upButton = document.getElementById("up-button");
	if (upButton)
	{
		upButton.addEventListener("touchstart", () => startMoving("up", Game, Game.leftPaddle), { passive: false });
		upButton.addEventListener("touchend", () => stopMoving(Game));
		upButton.addEventListener("touchcancel", () => stopMoving(Game));
	}

	let downButton = document.getElementById("down-button");
	if (downButton)
	{
		downButton.addEventListener("touchstart", () => startMoving("down", Game, Game.leftPaddle), { passive: false });
		downButton.addEventListener("touchend", () => stopMoving(Game));
		downButton.addEventListener("touchcancel", () => stopMoving(Game));
	}

	let upButtonRight = document.getElementById("up-button-right");
	if (upButtonRight)
	{
		upButtonRight.addEventListener("touchstart", () => startMoving("up", Game, Game.rightPaddle), { passive: false });
		upButtonRight.addEventListener("touchend", () => stopMoving(Game));
		upButtonRight.addEventListener("touchcancel", () => stopMoving(Game));
	}

	let downButtonRight = document.getElementById("down-button-right");
	if (downButtonRight)
	{
		downButtonRight.addEventListener("touchstart", () => startMoving("down", Game, Game.rightPaddle), { passive: false });
		downButtonRight.addEventListener("touchend", () => stopMoving(Game));
		downButtonRight.addEventListener("touchcancel", () => stopMoving(Game));
	}

}

function startMoving(direction, Game, side)
{
	if (Game.moveInterval) return; // Empêche de créer plusieurs intervalles simultanément
	Game.moveInterval = setInterval(() => {
		if (direction === "up") {
			side.position.y += 0.4; // Déplacement vers le haut
		} else if (direction === "down") {
			side.position.y -= 0.4; // Déplacement vers le bas
		}
	}, 16); // Déclenchement toutes les 16ms (~60 fps)
}

function stopMoving(Game)
{
	clearInterval(Game.moveInterval);
	Game.moveInterval = null; // Remet l'intervalle à l'état initial
}