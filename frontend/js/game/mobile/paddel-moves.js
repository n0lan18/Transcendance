
export function paddleMovesMobile(Game)
{
	let upButton = document.getElementById("up-button");
	if (upButton)
	{
		upButton.addEventListener("touchstart", () => startMoving("up", Game), { passive: false });
		upButton.addEventListener("touchend", () => stopMoving(Game));
		upButton.addEventListener("touchcancel", () => stopMoving(Game));
	}

	let downButton = document.getElementById("down-button");
	if (downButton)
	{
		downButton.addEventListener("touchstart", () => startMoving("down", Game), { passive: false });
		downButton.addEventListener("touchend", () => stopMoving(Game));
		downButton.addEventListener("touchcancel", () => stopMoving(Game));
	}
}

function startMoving(direction, Game)
{
	if (Game.moveInterval) return; // Empêche de créer plusieurs intervalles simultanément
	Game.moveInterval = setInterval(() => {
		if (direction === "up") {
			Game.leftPaddle.position.y += 0.4; // Déplacement vers le haut
		} else if (direction === "down") {
			Game.leftPaddle.position.y -= 0.4; // Déplacement vers le bas
		}
	}, 16); // Déclenchement toutes les 16ms (~60 fps)
}

function stopMoving(Game)
{
	clearInterval(Game.moveInterval);
	Game.moveInterval = null; // Remet l'intervalle à l'état initial
}