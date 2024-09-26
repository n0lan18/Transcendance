import { generateNavigator } from "./nav.js";
import { fetchUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";

export async function loadProfilePage()
{
	let userInfo = await fetchUserInfo();
	console.log(userInfo);

	let profileHTML = generateProfilePageHTML(userInfo);

	loadContent(profileHTML, "profile", true);
	document.getElementById("app").innerHTML = generateProfilePageHTML(userInfo);

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

function generateBodyProfilePageHTML()
{
	let principalStr = "Profile";
	return `
		<div>
			<h1>${principalStr}</h1>
		</div>
	`;
}

export function generateProfilePageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodyProfilePageHTML();

	return (nav + body);
}