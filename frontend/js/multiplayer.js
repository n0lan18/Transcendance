import { generateNavigator } from "./nav.js";
import { fetchUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";
import { Game } from "./game.js";

export async function loadMultiplayerPage()
{
	let userInfo = await fetchUserInfo();
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

function generateBodyMultiplayerPageHTML()
{
	let principalStr = "Multiplayer";
	return `
		<div>
			<h1>0 - 0</h1>
		</div>
		<div id="game-container" class="game-container"></div>
	`;
}

export function generateMultiplayerPageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodyMultiplayerPageHTML();

	return (nav + body);
}