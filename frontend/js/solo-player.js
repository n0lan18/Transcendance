import { decodeStrToHex, getMatchInfo, getTournamentInfo, isMobileDevice, loadContent} from "./utils.js";
import { Game } from "./game.js";
import { translation } from "./translate.js";

let game;

export async function loadSoloPlayerPage(pathname, namePage)
{
	const matchInfo = await getMatchInfo();
	let soloPlayerHTML = generateGamePageHTML(matchInfo.username1, matchInfo.username2);
	console.log(`matchInf0=${matchInfo}`);

	loadContent(document.getElementById('app'), soloPlayerHTML, `${pathname}`, true, `${namePage}`, translation, "", addEventListenerGamePage)

	document.getElementById("app").innerHTML = soloPlayerHTML;
}

/*window.addEventListener('popstate', async function (event) {
    if (event.state && event.state.page) {
        const pathname = this.window.location.pathname;

        // Chargement dynamique du contenu selon le type de page
        switch (pathname) {

            case "/game-page-simple-match":
				console.log("simple game started");
                loadContent(document.getElementById('app'), event.state.page, '', false, `Game Page Simple Match`, translation, "", addEventListenerGamePage);
                break;

            case "/game-page-double-match":
				console.log("double game started");
                loadContent(document.getElementById('app'), event.state.page, '', false, `Game Page Double Match`, translation, "", addEventListenerGamePage);
                break;
			
			case "/game-page-online-match":
				console.log("Online game started");
                loadContent(document.getElementById('app'), event.state.page, '', false, `Game Page Online Match`, translation, "", addEventListenerGamePage);
                break;

            default:
                // Si on quitte les pages de jeu, arrête le jeu si nécessaire
				if (Game.modeGame === "Online")
					console.log("Online game left");
                if (game && typeof game.destroy === "function") {
					game.destroy()
                    game = null;
                break;
        	}
    	}
	}
});*/

async function addEventListenerGamePage()
{
	if (game)
		game.destroy()
	game = null;
	const matchInfo = await getMatchInfo();
	let tournamentInfo;
	if (matchInfo.modeGame == "tournament-multi-local")
		tournamentInfo = await getTournamentInfo();
	else
	{
		tournamentInfo = {
			numberMatch: -1,
			tabPlayers: [],
			tabPlayersNewRound: [],
		};
	}
	let pageGameContainer = document.getElementById("page-game-container");
	if (matchInfo.superPower == "isNotSuperPower")
	{
		let progressBar = document.getElementById("progress-bar-container");
		let powerContainer = document.getElementById("power-container");
		progressBar.style.display = "none";
		powerContainer.style.display = "none";
	}
	if (pageGameContainer)
		game = new Game("game-container", matchInfo.modeGame, matchInfo.colorPlayer1, matchInfo.colorPlayer2, matchInfo.courtColor, matchInfo.heroPowerPlayer1, matchInfo.heroPowerPlayer2, matchInfo.username1, matchInfo.username2, matchInfo.typeOfGame, matchInfo.numberPlayers, matchInfo.superPower, tournamentInfo.numberMatch, tournamentInfo.tabPlayers, tournamentInfo.tabPlayersNewRound);
}


function generateBodyGamePageHTML(username, username2)
{
	return `
		<div class="page-game-container" id="page-game-container">
			<div class="message-change-orientation-game">
				<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
				<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
			</div>
			<div class="flex-game-container" id="flex-game-container">
				<div class="display-score-container">
					<div class="player1-container"><h2 class="player1-username">${username}</h2></div>
					<div class="score-container"><h1 class="board-score" id="board-score">0 - 0</h1></div>
					<div class="player2-container"><h2 class="player2-username">${username2}</h2></div>
				</div>
				<div class="progress-bar-container" id="progress-bar-container">
					<div class="progress-bar-left-container" id="progress-bar-left-container">
						<div class="progress-bar-left" id="progress-bar-left"></div>
					</div>
					<div class="progress-bar-right-container">
						<div class="progress-bar-right" id="progress-bar-right"></div>
					</div>
				</div>
				<div class="power-container" id="power-container">
					<div class="power-container-left" id="power-container-left"><h3 style="font-size: 15px">GAME BREAKER</h3></div>
					<div class="power-container-right" id="power-container-right"><h3 style="font-size: 15px">GAME BREAKER</h3></div>
				</div>
				<div id="game-container" class="game-container"></div>
				<div class="button-controller-left" id="button-controller-left">
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
				<div class="button-controller-right" id="button-controller-right">
					<button id="up-button-right" class="btn up-button btn-lg">
						<i class="fa-solid fa-chevron-left"></i>
					</button>
					<div class="pause-camera-button-container">
						<button id="pause-button-right" class="btn pause-button">
							<i class="fa-solid fa-pause"></i>
						</button>
						<button id="special-shot-button-right" class="btn special-shot-button">
							<i class="fa-solid fa-bullseye"></i>
						</button>
					</div>
					<button id="down-button-right" class="btn down-button btn-lg">
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