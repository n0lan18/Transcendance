import { startCountdown } from "./countdown.js";


export function fullScreen(Game) {
    // Conteneur du décompte à afficher sur l'écran
	const backgrondCountdownContainer = document.createElement("div");
	backgrondCountdownContainer.id = "background-countdown";
	backgrondCountdownContainer.style.position = "absolute";
	backgrondCountdownContainer.style.top = "0%";
	backgrondCountdownContainer.style.left = "0";
	backgrondCountdownContainer.style.width = "100%";
	backgrondCountdownContainer.style.height = "100%";
	backgrondCountdownContainer.style.background = "black";
	backgrondCountdownContainer.style.zIndex = "10";
	backgrondCountdownContainer.style.opacity = "0.2"

	const messageFullscreen = document.createElement("div");
	messageFullscreen.innerText = "Click screen to continue";
	messageFullscreen.style.position = "absolute";
	messageFullscreen.style.top = "50%";
	messageFullscreen.style.left = "50%";
	messageFullscreen.style.transform = "translate(-50%, -50%)";
	messageFullscreen.style.fontSize = "24px";
	messageFullscreen.style.color = "white";
	messageFullscreen.style.zIndex = "1000";

	const container = document.getElementById("game-container");
	if (container)
	{
		container.appendChild(backgrondCountdownContainer);
		container.appendChild(messageFullscreen);
	}

	backgrondCountdownContainer.addEventListener("click", () => {
		const gameContainer = document.querySelector('.flex-game-container');
		gameContainer.requestFullscreen().catch(err => {
			console.error(`Erreur lors de la tentative d'activation du plein écran: ${err.message} (${err.name})`);
		});
		messageFullscreen.remove();
		backgrondCountdownContainer.remove();

		Game.start();
	});

	window.addEventListener('touchstart', (event) => {
		if (event.target.id === "background-countdown")
		{
			const gameContainer = document.querySelector('.flex-game-container');
			gameContainer.requestFullscreen().catch(err => {
				console.error(`Erreur lors de la tentative d'activation du plein écran: ${err.message} (${err.name})`);
			});
			backgrondCountdownContainer.remove();
			messageFullscreen.remove();
			Game.start();
		}
	});
}