import { checkIsTournament, loadContent, replaceContent } from "./utils.js";
import { generateNavigator } from "./nav.js";
import { getUserInfo } from "./utils.js";
import { loadProfilePage } from "./profile.js";
import { loadStatsPage } from "./stats.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { translation } from "./translate.js";
import { loadPreparationSimpleMatchGamePage } from "./preparation-simple-match-game-page.js";
import { loadPreparationTournamentGamePage } from "./preparation-tournament-game-page.js";
import { loadContinueOrNewTournamentPage } from "./continue-or-finish-page.js";
import { loadOnlineGamePage } from "./online.js";


let globalSocket = null;

export async function loadHomePage()
{
	let userInfo = await getUserInfo();

	// Vérifiez si une connexion WebSocket existe déjà
	if (!globalSocket || globalSocket.readyState === WebSocket.CLOSED) {
		let jwtToken = localStorage.getItem('jwt_token');
		globalSocket = new WebSocket(`wss://localhost:8443/ws/online/?token=${jwtToken}`);
		console.log("Nouvelle connexion WebSocket créée.");
		setupWebSocketListeners(globalSocket, userInfo);
	} else {
		console.log("Réutilisation de la connexion WebSocket existante.");
	}
	
	// Si la connexion est ouverte, envoyez un message de connexion
	if (globalSocket.readyState === WebSocket.OPEN) {
			globalSocket.send(JSON.stringify({
			event: "connect",
			username: userInfo.username
		}));
	} else {
		// Gérer le cas où la connexion est en train d’être ouverte
		globalSocket.onopen = () => {
			globalSocket.send(JSON.stringify({
			event: "connect",
			username: userInfo.username
			}));
		};
	}

	let homeHTML = generateHomePageHTML(userInfo);

	loadContent(document.getElementById("app"), homeHTML, "home", true, 'Home Page', translation, addNavigatorEventListeners, addEventListenerHomePage);
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/home")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Home Page', translation, addNavigatorEventListeners, addEventListenerHomePage);
	}
});

export function addEventListenerHomePage()
{
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
	
	let switchPageToTournamentPage = document.getElementById("tournament-button");
	if (switchPageToTournamentPage)
	{
		switchPageToTournamentPage.addEventListener('click', async function (event) {
			event.preventDefault();
			let checkIsTour = await checkIsTournament();
			if (checkIsTour)
				loadContinueOrNewTournamentPage();
			else
				loadPreparationTournamentGamePage();
		});
	}

	let switchPageToOnlinesPage = document.getElementById("online-button");
	if (switchPageToOnlinesPage)
	{
		switchPageToOnlinesPage.addEventListener('click', function (event) {
			event.preventDefault();
			loadOnlineGamePage();
		});
	}

	let switchPageToSimpleMatchPage = document.getElementById("simple-match-button");
	if (switchPageToSimpleMatchPage)
	{
		switchPageToSimpleMatchPage.addEventListener('click', function (event) {
			event.preventDefault();
			loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerTwo");
		});
	}

	let switchPageToDoublesPage = document.getElementById("doubles-button");
	if (switchPageToDoublesPage)
	{
		switchPageToDoublesPage.addEventListener('click', function (event) {
			event.preventDefault();
			loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerFour");
		});
	}
}

function setupWebSocketListeners(socket, userInfo) {
    // WebSocket événement `onmessage`
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Message reçu du serveur :", message);

        // Gestion de l'événement `ping`
        if (message.event === "ping") {
            console.log("Ping reçu, envoi du Pong.");
            socket.send(JSON.stringify({ event: "pong" }));
        }

        // Mise à jour de l'état de connexion
        if (message.isConnect !== undefined) {
            console.log(`L'utilisateur ${userInfo.username} est maintenant ${message.isConnect ? "en ligne" : "hors ligne"}.`);
        }
    };

    // WebSocket événement `onclose`
    socket.onclose = (event) => {
        console.warn("WebSocket connection closed :", event);
    };

    // WebSocket événement `onerror`
    socket.onerror = (error) => {
        console.error("WebSocket error :", error);
    };
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
				<button id="tournament-button" class="flex-item box3">
					<img class="img-box3-4" src="../images/trophy-logo-white.png" alt="logo solo" width="175" height="175">
					<div class="item-name">
						<h1 data-translate-key="tournament"></h1>
					</div>
				</button>
				<button id="online-button" class="flex-item box4">
					<img class="img-box3-4" src="../images/online-logo-white.png" alt="logo solo" width="175" height="175">
					<div class="item-name">
						<h1 data-translate-key="online"></h1>
					</div>
				</button>
				<button id="simple-match-button" class="flex-item box5">
					<img class="img-box5-6" src="../images/multiplayer-logo-2-players-white.png" alt="logo 2 players" width="100" height="100">
					<div class="item-name">
						<h1 data-translate-key="simple"></h1>
						<h3 data-translate-key="one-vs-one"></h3>
					</div>
				</button>
				<button id="doubles-button" class="flex-item box6">
					<img class="img-box5-6" src="../images/multiplayer-logo-4-players-white.png" alt="logo 4 players" width="100" height="100">
					<div class="item-name">
						<h1 data-translate-key="doubles"></h1>
						<h3 data-translate-key="two-vs-two"></h3>
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

