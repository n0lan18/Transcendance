import { loadContent } from "./utils.js";
import { generateNavigator } from "./nav.js";
import { fetchUserInfo } from "./utils.js";
import { loadProfilePage } from "./profile.js";
import { loadSoloPlayerPageChoiceGame } from "./solo-player-page.js";
import { loadStatsPage } from "./stats.js";
import { loadMultiplayerPage } from "./multiplayer.js";
import { loadOnlinePage } from "./online.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";

export async function loadHomePage()
{
	let userInfo = await fetchUserInfo();
	console.log(userInfo);

	let homeHTML = generateHomePageHTML(userInfo);

	loadContent(homeHTML, "home", true);
	document.getElementById("app").innerHTML = generateHomePageHTML(userInfo);

	addNavigatorEventListeners();

	let switchPageToProfilPage = document.getElementById("profil-button");
	if (switchPageToProfilPage)
	{
		switchPageToProfilPage.addEventListener('click', function (event) {
			event.preventDefault();
			loadProfilePage();
		});
	}

	let switchPageToStatsPage = document.getElementById("stats-button");
	if (switchPageToStatsPage)
	{
		switchPageToStatsPage.addEventListener('click', function (event) {
			event.preventDefault();
			loadStatsPage();
		});
	}	

	let switchPageToSoloPlayerPage = document.getElementById("solo-player-button");
	if (switchPageToSoloPlayerPage)
	{
		switchPageToSoloPlayerPage.addEventListener('click', function (event) {
			event.preventDefault();
			loadSoloPlayerPageChoiceGame();
		});
	}

	let switchPageToMultiplayerPage = document.getElementById("multiplayer-button");
	if (switchPageToMultiplayerPage)
	{
		switchPageToMultiplayerPage.addEventListener('click', function (event) {
			event.preventDefault();
			loadMultiplayerPage();
		});
	}

	let switchPageToOnlinePage = document.getElementById("online-button");
	if (switchPageToOnlinePage)
	{
		switchPageToOnlinePage.addEventListener('click', function (event) {
			event.preventDefault();
			loadOnlinePage();
		});
	}	

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page) {
			// Charger le contenu associé à la page
			loadContent(event.state.page, '', false); // Pas besoin d'ajouter à l'historique à nouveau
		}
	});
}

function generateBodyHomePageHTML(username)
{
	let profilStr = "Profile";
	if (username !== "")
		profilStr = username;
	let statsStr = "Statistics";
	let soloStr = "Solo";
	let multiplayerStr = "Multiplayer";
	let onlineStr = "Online";
	return `
		<div class="flex-container">
				<button id="profil-button" class="flex-item box1">
					<img class="img-box1-2" src="../images/profile-logo-white.png" alt="logo profile" width="70" height="70">
					<div class="item-name"
						<h1>${profilStr}</h1>
					</div>
				</button>
				<button id="stats-button" class="flex-item box2">
					<img class="img-box1-2" src="../images/stat-logo-white.png" alt="logo settings" width="70" height="70">
					<div class="item-name"
						<h1>${statsStr}</h1>
					</div>
				</button>
				<button id="solo-player-button" class="flex-item box3">
					<img class="img-box3" src="../images/solo-logo-white.png" alt="logo solo" width="175" height="175">
					<div class="item-name"
						<h1>${soloStr}</h1>
					</div>
				</button>
				<button id="multiplayer-button" class="flex-item box4">
					<img class="img-box4-5" src="../images/multiplayer-logo-white.png" alt="logo multiplayer" width="100" height="100">
					<div class="item-name"
						<h1>${multiplayerStr}</h1>
					</div>
				</button>
				<button id="online-button" class="flex-item box5">
					<img class="img-box4-5" src="../images/online-logo-white.png" alt="logo online" width="100" height="100">
					<div class="item-name"
						<h1>${onlineStr}</h1>
					</div>
				</button>
		</div>
	`;
}

export function generateHomePageHTML(userInfo)
{
	let nav = generateNavigator();
	let body = generateBodyHomePageHTML(userInfo.username);

	return (nav + body);
}

