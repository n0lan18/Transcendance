import { translation } from "./translate.js";
import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { GetSocket } from "./websocket.js";
//import { loadOnlinePage } from "./online-game.js";
import { putMatchInfo } from "./utils.js";
import { loadSoloPlayerPage } from "./solo-player.js";
import { getUserInfo } from "./utils.js";

export async function loadGameSearchPage()
{
	document.getElementById("app").innerHTML = generateSearchPageHTML();
	translation();
	addNavigatorEventListeners();

	const socket = GetSocket();
	addEventListenerGameSearch(socket);

	socket.onmessage = async (event) => {

		const data = JSON.parse(event.data);

		console.log("socket.onmessage");
		if (data.action == "match_found") {
			console.log("Adversaire trouve :", data);
			sessionStorage.setItem("role", data.role);

			let username1, username2, courtColor, colorPlayer1, colorPlayer2, heroPowerPlayer1, heroPowerPlayer2, superPower;

			if (data.role == "player1")
			{
				username1 = data.username;
				username2 = data.opponent.username;
				courtColor = data.court;
				colorPlayer1 = data.color;
				colorPlayer2 = data.opponent.color;
				heroPowerPlayer1 = data.character;
				heroPowerPlayer2 = data.opponent.character;
				superPower = data.superpower;
			}
			else if (data.role == "player2")
			{
				username1 = data.opponent.username;
				username2 = data.username;
				courtColor = data.court;
				colorPlayer1 = data.opponent.color;
				colorPlayer2 = data.color;
				heroPowerPlayer1 = data.opponent.character;
				heroPowerPlayer2 = data.character;
				superPower = data.opponent.superpower;
			}
			console.log(`Appel de loadSoloPlayerPage avec username1=${username1}, heroPowerPlayer1=${heroPowerPlayer1}, colorPlayer1=${colorPlayer1};  username2=${username2}, heroPowerPlayer2=${heroPowerPlayer2}, colorPlayer2=${colorPlayer2}; superPower=${superPower}`);
			await putMatchInfo(username1, username2, courtColor, colorPlayer1, colorPlayer2, heroPowerPlayer1, heroPowerPlayer2, "Online", 2, "Online", superPower)
			console.log(`Appel de putMatchInfo`);
			let pathnameUrl;
			let namePage;
			pathnameUrl = "game-page-online-match";
			namePage = "Game Page Online Match";
			document.getElementById("player-preparation-container").style.display = "block";
			//document.querySelector(".solo-player-choice-game-container h1").style.display = "none";

			document.getElementById("usernameGamePlayer1-text").textContent = username1;
			document.getElementById("color-button-red-player1").style.backgroundColor = colorPlayer1;
			if(heroPowerPlayer1 === "Duplication")
			{
				document.getElementById("superhero-image").src = "../images/super2.png";
				document.getElementById("superhero-power-text-player1").textContent = "Duplication";
			}
			else if (heroPowerPlayer1 === "Super strength")
			{
				document.getElementById("superhero-image").src = "../images/super3.png";
				document.getElementById("superhero-power-text-player1").textContent = "Super strength";
			}
			else if (heroPowerPlayer1 === "Time laps")
			{
				document.getElementById("superhero-image").src = "../images/super4.png";
				document.getElementById("superhero-power-text-player1").textContent = "Time laps";
			}

			document.getElementById("usernameGamePlayer2-text").textContent = username2;
			document.getElementById("color-button-red-player2").style.backgroundColor = colorPlayer2;
			if(heroPowerPlayer2 === "Duplication")
			{
				document.getElementById("superhero-image2").src = "../images/super2.png";
				document.getElementById("superhero-power-text-player2").textContent = "Duplication";
			}
			else if (heroPowerPlayer2 === "Super strength")
			{
				document.getElementById("superhero-image2").src = "../images/super3.png";
				document.getElementById("superhero-power-text-player2").textContent = "Super strength";
			}
			else if (heroPowerPlayer2 === "Time laps")
			{
				document.getElementById("superhero-image2").src = "../images/super4.png";
				document.getElementById("superhero-power-text-player2").textContent = "Time laps";
			}
			let countdown = 3; // Départ du décompte

			// Fonction qui met à jour l'affichage du décompte
			const intervalId = setInterval(() => {
				document.getElementById("searchinprogresse").textContent = `Demarrage de la partie dans ${countdown}s`; // Affiche le chiffre actuel
				countdown -= 1;
		
				if (countdown < 0) {
					clearInterval(intervalId); // Arrête le décompte une fois à 0		
					setTimeout(() => {						
						loadSoloPlayerPage(pathnameUrl, namePage);
					}, 500); // Attend un peu avant de commencer pour que "Go!" reste visible
				}
			}, 1000);
		}
	}
}

export async function addEventListenerGameSearch(socket)
{	
	let userInfo = await getUserInfo();

	let userId = userInfo.id;
	let username = userInfo.username;

	window.addEventListener('beforeunload', () => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			console.log("before console unload with socket");
			socket.send(JSON.stringify({
			type: 'stop_search',
			player_id: userId,
			username: username
			}));
		}
	});
}

function SearchPageGameHTML()
{
	return `
		<div class="preparation-game-container" id="preparation-game-container">
			<h1 data-translate-key="onlineMatch"></h1>
			<div class="player-preparation-container" id="player-preparation-container" style="display: none;">
				<div class="player-preparation-container-content">
					<div class="player-left-preparation">
						<h2 id="usernameGamePlayer1-text"></h2>
						<div class="superhero-container" id="superhero-container1">
							<div class="chose-superhero-container" id="chose-superhero-container1">
								<img id="superhero-image" class="superhero-image" src="../images/super1.png" alt="Photo Album" style="width: 40%; height: 40%; border-radius: 10px;">
							</div>
							<div class="superhero-power-text" id="superhero-power-text">
								<i class="fa-brands fa-superpowers" style="font-size: 15px; text-align: center;"></i>
								<p id="superhero-power-text-player1">Invisible</p>
							</div>
						</div>
						<div class="color-button-container color-button-container-player1">
							<div class="color-button-text">
								<button id="color-button-red-player1" class="color-button color-button-player1" style="background-color: #E23F22; border: 3px solid #ffffff;"></button>
								<p class="text-under-color-button" data-translate-key="textUnderColorButton1"></p>
							</div>
						</div>
					</div>
					<div class="player-right-preparation">
						<h2 id="usernameGamePlayer2-text"></h2>
						<div class="superhero-container" id="superhero-container2">
							<div class="chose-superhero-container" id="chose-superhero-container2">
								<img id="superhero-image2" class="superhero-image" src="../images/super3.png" alt="Photo Album" style="width: 40%; height: 40%; border-radius: 10px;">
							</div>
							<div class="superhero-power-text" id="superhero-power-text2">
								<i class="fa-brands fa-superpowers" style="font-size: 15px; text-align: center;"></i>
								<p id="superhero-power-text-player2">Super strength</p>
							</div>
						</div>
						<div class="color-button-container color-button-container-player2">
							<div class="color-button-text">
								<button id="color-button-red-player2" class="color-button color-button-player2" style="background-color: #E23F22;"></button>
								<p class="text-under-color-button" data-translate-key="textUnderColorButton1"></p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="solo-player-choice-game-container">
				<h1 id="searchinprogresse" >Recherche en cours</h1>
			</div>
		</div>
	`;
}

export function generateSearchPageHTML()
{
	let nav = generateNavigator();
	let body = SearchPageGameHTML()

	return (nav + body);
}