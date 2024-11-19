import { isMobileDevice, loadContent, putStatsInfo } from "./utils.js";
import { Game } from "./game.js";
import { translation } from "./translate.js";

export async function loadSoloPlayerPage(username1, username2, courtColor, colorPlayer1, colorPlayer2, heroPowerPlayer1, heroPowerPlayer2, styleMatch, numberPlayers, playerSize)
{
	let soloPlayerHTML = generateGamePageHTML(username1, username2);

	loadContent(soloPlayerHTML, "solo-player", true);
	document.getElementById("app").innerHTML = soloPlayerHTML;
	translation();
	let pageGameContainer = document.getElementById("page-game-container");
	toggleFullScreen();
	if (pageGameContainer)
	{
		if (styleMatch == "simple-match")
			await putStatsInfo(3, {numberSimpleMatch: 1});
		else if (styleMatch == "tournament")
			await putStatsInfo(6, {numberMatchTournament: 1});
		const game = new Game("game-container", playerSize, colorPlayer1, colorPlayer2, courtColor, heroPowerPlayer1, heroPowerPlayer2, username1, username2, styleMatch, numberPlayers);
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
	return `
		<div class="page-game-container" id="page-game-container">
			<div class="message-change-orientation">
				<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
				<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
			</div>
			<div class="flex-game-container" id="flex-game-container">
				<div class="display-score-container">
					<div class="player1-container"><h2 class="player1-username">${username}</h2></div>
					<div class="score-container"><h1 class="board-score" id="board-score">0 - 0</h1></div>
					<div class="player2-container"><h2 class="player2-username">${username2}</h2></div>
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