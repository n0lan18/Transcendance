import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { generateNavigator } from "./nav.js";
import { getUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";
import { newWebSocket } from "./websocket.js"

export async function loadOnlinePage()
{
	let userInfo = await getUserInfo();
	console.log(userInfo);

	let onlineHTML = generateOnlinePageHTML(userInfo);

	loadContent(onlineHTML, "online", true);
	document.getElementById("app").innerHTML = generateOnlinePageHTML();

	addNavigatorEventListeners()

	newWebSocket();

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

export function generateOnlinePageHTML()
{
	let nav = generateNavigator();
	let body = generateBodyOnlinePageHTML();

	return (nav + body);
}