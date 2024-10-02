import { generateNavigator } from "./nav.js";
import { fetchUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";
import { Game } from "./game.js";

export async function loadSoloPlayerPage()
{
	let userInfo = await fetchUserInfo();
	console.log(userInfo);

	let soloGameHTML = generateSoloPlayerPageHTML(userInfo);

	loadContent(soloGameHTML, "profile", true);

	document.getElementById("app").innerHTML = soloGameHTML;
	console.log(document.getElementById('app').clientWidth);
	console.log(document.getElementById('game-container').clientWidth);

	const game = new Game("game-container");
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

function generateBodySoloPlayerPageHTML()
{
	return `
		<div id="game-container" class="game-container"></div>
	`;
}

export function generateSoloPlayerPageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodySoloPlayerPageHTML();

	return (nav + body);
}