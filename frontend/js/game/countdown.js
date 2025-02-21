

export function startCountdown(Game) {
    if (Game.gameState === "running") return;

    Game.gameState = "countdown";
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

    const countdownContainer = document.createElement("div");
    countdownContainer.id = "countdown";
    countdownContainer.style.position = "absolute";
    countdownContainer.style.top = "50%";
    countdownContainer.style.left = "50%";
    countdownContainer.style.transform = "translate(-50%, -50%)";
    countdownContainer.style.fontSize = "48px";
    countdownContainer.style.color = "white";
    countdownContainer.style.textAlign = "center";
	countdownContainer.style.zIndex = "20";

	const container = document.getElementById("game-container");
    if (container)
    {
	    container.appendChild(backgrondCountdownContainer);
        container.appendChild(countdownContainer);
    }

    let countdown = 3; // Départ du décompte

    // Fonction qui met à jour l'affichage du décompte
    const intervalId = setInterval(() => {
        countdownContainer.innerText = countdown; // Affiche le chiffre actuel
        countdown -= 1;

        if (countdown < 0) {
            clearInterval(intervalId); // Arrête le décompte une fois à 0
            countdownContainer.innerText = "Go!"; // Affiche "Go!" avant de démarrer

            setTimeout(() => {
				backgrondCountdownContainer.remove();
                countdownContainer.remove(); // Retire le conteneur de décompte
				Game.start();
                if (Game.isplayer1 && Game.modeGame == "Online")	 {  
                    let message = {
                        type: "update_ball",
                        player: "player1",
                        collision: "goal",
                        position: { x: Game.ball.position.x, y: Game.ball.position.y },
                        velocity: { x: Game.ballVelocity.x, y: Game.ballVelocity.y },
                        superpowerleft: null,
                        superpowerright: null
                    };
                    Game.socket.send(JSON.stringify(message));
                    console.log("Envoi WebSocket MaJ balle J1 :", message);
                } 
                else if (!Game.isplayer1 && Game.modeGame == "Online")	 {  
                    let message = {
                        type: "update_ball",
                        player: "player2",
                        collision: "goal",
                        position: { x: Game.ball.position.x, y: Game.ball.position.y },
                        velocity: { x: Game.ballVelocity.x, y: Game.ballVelocity.y },
                        superpowerleft: null,
                        superpowerright: null
                    };
                    Game.socket.send(JSON.stringify(message));
                    console.log("Envoi WebSocket MaJ balle J2 :", message);
                }
            }, 500); // Attend un peu avant de commencer pour que "Go!" reste visible
		}
    }, 1000); // Le décompte diminue toutes les secondes
}