import { translation } from "./translate.js";
import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { GetSocket } from "./websocket.js";
//import { loadOnlinePage } from "./online-game.js";
import { putMatchInfo } from "./utils.js";
import { loadSoloPlayerPage } from "./solo-player.js";

export async function loadGameSearchPage()
{
	document.getElementById("app").innerHTML = generateSearchPageHTML();
	translation();
	addNavigatorEventListeners()

	const socket = GetSocket();

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
			loadSoloPlayerPage(pathnameUrl, namePage);
		}
	}
}

function SearchPageGameHTML()
{
	return `
		<div class="solo-player-choice-game-container">
			<h1>Page de recherche</h1>
		</div>
	`;
}

export function generateSearchPageHTML()
{
	let nav = generateNavigator();
	let body = SearchPageGameHTML()

	return (nav + body);
}