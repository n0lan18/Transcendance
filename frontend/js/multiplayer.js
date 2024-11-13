import { generateNavigator } from "./nav.js";
import { getUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";
import { Game } from "./game.js";

export async function loadMultiplayerPage()
{
	let userInfo = await getUserInfo();
	console.log(userInfo);

	let multiplayerHTML = generateMultiplayerPageHTML(userInfo);

	loadContent(multiplayerHTML, "multiplayer", true);
	document.getElementById("app").innerHTML = multiplayerHTML;

	const game = new Game("game-container", "multiplayerGame");
	game.start();

	let switchPageToLogout = document.getElementById("logoutLink");
	if (switchPageToLogout)
	{
		switchPageToLogout.addEventListener('click', function (event) {
			localStorage.removeItem('jwt_token');
			event.preventDefault();
			loadAuthentificationPage();
		});
	}

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page) {
			// Charger le contenu associé à la page
			loadContent(event.state.page, '', false); // Pas besoin d'ajouter à l'historique à nouveau
		}
	});
}

function generateBodyMultiplayerPageHTML(username)
{
	let player1Str;
	if (username)
		player1Str = username;
	else
		player1Str = "Player 1";
	return `
		<div class="flex-game-container">
			<div class="display-score-container">
				<div class="player1-container"><h2>${player1Str}</h2></div>
				<div class="score-container"><h1 id="board-score">0 - 0</h1></div>
				<div class="player2-container"><h2>Player 2</h2></div>
			</div>
			<div id="game-container" class="game-container"></div>
		</div>
	`;
}

export function generateMultiplayerPageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodyMultiplayerPageHTML(userInfo.username);

	return (nav + body);
}