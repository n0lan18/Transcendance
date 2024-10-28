import { loadContent } from "./utils.js";
import { Game } from "./game.js";

export async function loadSoloPlayerPage(username1, username2, courtColor, colorPlayer1, colorPlayer2, heroPowerPlayer1, heroPowerPlayer2)
{

	let soloPlayerHTML = generateGamePageHTML(username1, username2);

	loadContent(soloPlayerHTML, "solo-player", true);
	document.getElementById("app").innerHTML = soloPlayerHTML;
	let pageGameContainer = document.getElementById("page-game-container");
	toggleFullScreen();
	if (pageGameContainer)
	{
		console.log(colorPlayer1);
		console.log(colorPlayer2);
		const game = new Game("game-container", "soloPlayer", colorPlayer1, colorPlayer2, courtColor, heroPowerPlayer1, heroPowerPlayer2);
		game.start();
	}

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page) {
			// Charger le contenu associé à la page
			loadContent(event.state.page, '', false); // Pas besoin d'ajouter à l'historique à nouveau
		}
	});
}

function toggleFullScreen() {
    const gameContainer = document.querySelector('.flex-game-container');
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => {
            console.error(`Erreur lors de la tentative d'activation du plein écran: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

function generateBodyGamePageHTML(username, username2)
{
	let messageChangeOrientation = "Please rotate your device<br>to landscape mode";
	return `
		<div class="page-game-container" id="page-game-container">
			<div class="message-change-orientation">
				<h1 style="font-size: 25px; text-align: center;">${messageChangeOrientation}</h1>
				<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
			</div>
			<div class="flex-game-container">
				<div class="display-score-container">
					<div class="player1-container"><h2>${username}</h2></div>
					<div class="score-container"><h1 id="board-score">0 - 0</h1></div>
					<div class="player2-container"><h2>${username2}</h2></div>
				</div>
				<div class="progress-bar-container">
					<div class="progress-bar-left-container" id="progress-bar-left-container">
						<div class="progress-bar-left" id="progress-bar-left"></div>
					</div>
					<div class="progress-bar-right-container">
						<div class="progress-bar-right" id="progress-bar-right"></div>
					</div>
				</div>
				<div class="power-container">
					<div class="power-container-left" id="power-container-left"><h3 style="font-size: 15px">GAME BREAKER</h3></div>
					<div class="power-container-right" id="power-container-right"><h3 style="font-size: 15px">GAME BREAKER</h3></div>
				</div>
				<div id="game-container" class="game-container"></div>
				<div class="button-controller" id="button-controller">
					<button id="up-button" class="btn up-button btn-lg">
						<i class="fa-solid fa-chevron-left"></i>
					</button>
					<div class="pause-camera-button-container">
						<button id="pause-button" class="btn pause-button">
							<i class="fa-solid fa-pause"></i>
						</button>
						<button id="special-shot-button" class="btn special-shot-button">
							<i class="fa-solid fa-bullseye"></i>
						</button>
					</div>
					<button id="down-button" class="btn down-button btn-lg">
						<i class="fa-solid fa-chevron-right"></i>
					</button>
				</div>
			</div>
		</div>
	`;
}

function generateGamePageHTML(username, username2)
{
	let body = generateBodyGamePageHTML(username, username2);

	return (body);
}