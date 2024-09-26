import { generateNavigator } from "./nav.js";
import { fetchUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";

export async function loadSettingsPage()
{
	let userInfo = await fetchUserInfo();
	console.log(userInfo);

	let settingsHTML = generateSettingsPageHTML(userInfo);

	loadContent(settingsHTML, "settings", true);
	document.getElementById("app").innerHTML = generateSettingsPageHTML(userInfo);

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

function generateBodySettingsPageHTML()
{
	let principalStr = "Settings";
	return `
		<div>
			<h1>${principalStr}</h1>
		</div>
	`;
}

export function generateSettingsPageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodySettingsPageHTML();

	return (nav + body);
}