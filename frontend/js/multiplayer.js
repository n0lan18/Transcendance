import { generateNavigator } from "./nav.js";
import { fetchUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";

export async function loadMultiplayerPage()
{
	let userInfo = await fetchUserInfo();
	console.log(userInfo);

	let settingsHTML = generateMultiplayerPageHTML(userInfo);

	loadContent(settingsHTML, "settings", true);
	document.getElementById("app").innerHTML = generateMutliplayerPageHTML(userInfo);

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
			<h1>${principalStr}</h1>
		</div>
	`;
}

export function generateMultiplayerPageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodyMultiplayerPageHTML();

	return (nav + body);
}