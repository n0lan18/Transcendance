import { generateNavigator } from "./nav.js";
import { getUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";

export async function loadOnlinePage()
{
	let userInfo = await getUserInfo();
	console.log(userInfo);

	let settingsHTML = generateOnlinePageHTML(userInfo);

	loadContent(settingsHTML, "settings", true);
	document.getElementById("app").innerHTML = generateOnlinePageHTML(userInfo);

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

function generateBodyOnlinePageHTML()
{
	let principalStr = "Online";
	return `
		<div>
			<h1>${principalStr}</h1>
		</div>
	`;
}

export function generateOnlinePageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodyOnlinePageHTML();

	return (nav + body);
}