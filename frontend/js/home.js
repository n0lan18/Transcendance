import { loadContent } from "./utils.js";
import { generateNavigator } from "./nav.js";
import { getUserInfo } from "./utils.js";
import { loadProfilePage } from "./profile.js";
import { loadSoloPlayerPageChoiceGame } from "./solo-player-page.js";
import { loadStatsPage } from "./stats.js";
import { loadMultiPlayerPageChoiceGame } from "./multiplayer.js";
import { loadOnlinePage } from "./online.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { translation } from "./translate.js";

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

	console.log(userInfo);
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
			loadMultiPlayerPageChoiceGame();
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
		</div>
	`;
}

export function generateHomePageHTML(userInfo)
{
	let nav = generateNavigator();
	let body = generateBodyHomePageHTML(userInfo.username, userInfo.profile_photo);

	return (nav + body);
}

