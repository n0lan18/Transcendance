import { loadContent } from "./utils.js";
import { generateNavigator } from "./nav.js";
import { getUserInfo } from "./utils.js";
import { loadProfilePage } from "./profile.js";
import { loadSoloPlayerPageChoiceGame } from "./solo-player-page.js";
import { loadStatsPage } from "./stats.js";
import { loadMultiplayerPage } from "./multiplayer.js";
import { loadOnlinePage } from "./online.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { translation } from "./translate.js";

export async function loadHomePage()
{
	let userInfo = await getUserInfo();

	let homeHTML = generateHomePageHTML(userInfo);

	loadContent(homeHTML, "home", true);

	document.getElementById("app").innerHTML = generateHomePageHTML(userInfo);
	translation();
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
			loadSoloPlayerPageChoiceGame(userInfo);
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



function generateBodyHomePageHTML(username, profile_photo)
{
	let imgProfile;
	if (profile_photo)
		imgProfile = profile_photo;
	else
		imgProfile = "../images/profile-logo-white.png";
	let profilStr = "Profile";
	if (username !== "")
		profilStr = username;
	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="flex-container">
				<button id="profil-button" class="flex-item box1">
					<img class="img-box1-2" src="${imgProfile}" alt="logo profile" width="70" height="70">
					<div class="item-name">
						<h1 data-translate-key="profile"></h1>
					</div>
				</button>
				<button id="stats-button" class="flex-item box2">
					<img class="img-box1-2" src="../images/stat-logo-white.png" alt="logo settings" width="70" height="70">
					<div class="item-name">
						<h1 data-translate-key="statistics"></h1>
					</div>
				</button>
				<button id="solo-player-button" class="flex-item box3">
					<img class="img-box3" src="../images/solo-logo-white.png" alt="logo solo" width="175" height="175">
					<div class="item-name">
						<h1 data-translate-key="solo"></h1>
					</div>
				</button>
				<button id="multiplayer-button" class="flex-item box4">
					<img class="img-box4-5" src="../images/multiplayer-logo-white.png" alt="logo multiplayer" width="100" height="100">
					<div class="item-name">
						<h1 data-translate-key="multiplayer"></h1>
					</div>
				</button>
				<button id="online-button" class="flex-item box5">
					<img class="img-box4-5" src="../images/online-logo-white.png" alt="logo online" width="100" height="100">
					<div class="item-name">
						<h1 data-translate-key="online"></h1>
					</div>
				</button>
		</div>
	`;
}

export function generateHomePageHTML(userInfo)
{
	let nav = generateNavigator();
	let body = generateBodyHomePageHTML(userInfo.username, userInfo.profile_photo);

	return (nav + body);
}

