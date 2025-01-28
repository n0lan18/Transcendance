

export function pausePage(Game) {
	let pauseStr = "Pause";

    // Conteneur du décompte à afficher sur l'écran
	const backgroundPauseContainer = document.createElement("div");
	backgroundPauseContainer.id = "background-pause";
	backgroundPauseContainer.style.position = "absolute";
	backgroundPauseContainer.style.top = "0%";
	backgroundPauseContainer.style.left = "0";
	backgroundPauseContainer.style.width = "100%";
	backgroundPauseContainer.style.height = "100%";
	backgroundPauseContainer.style.background = "black";
	backgroundPauseContainer.style.zIndex = "10";
	backgroundPauseContainer.style.opacity = "0.2"

    const pauseContainer = document.createElement("div");
    pauseContainer.id = "countdown";
	pauseContainer.innerText = pauseStr;
    pauseContainer.style.position = "absolute";
    pauseContainer.style.top = "50%";
    pauseContainer.style.left = "50%";
    pauseContainer.style.transform = "translate(-50%, -50%)";
    pauseContainer.style.fontSize = "48px";
    pauseContainer.style.color = "white";
    pauseContainer.style.textAlign = "center";
	pauseContainer.style.zIndex = "20";

	const container = document.getElementById("game-container");
	container.appendChild(backgroundPauseContainer);
    container.appendChild(pauseContainer);
}