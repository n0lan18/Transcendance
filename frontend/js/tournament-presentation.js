import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { decodeStrToHex, getTournamentInfo, getUserInfo, loadContent, putMatchInfo, replaceContent } from "./utils.js";
import { translation } from "./translate.js";
import { generateNavigator } from "./nav.js";
import { loadPresentationMultiLocalPlayerPage } from "./presentation-match-multi-local-tournament.js";
import { putTournamentInfoNewRound } from "./utils.js";
import { addEventListenerHomePage, generateHomePageHTML } from "./home.js";

export function loadTournamentPresentation()
{
	const tournamentPresentationHTML = generateTournamentPresentation();

    loadContent(document.getElementById("app"), tournamentPresentationHTML, "tournament-presentation", true, 'Tournament Presentation Page', translation, addNavigatorEventListeners, createTableau);

	document.getElementById("app").innerHTML = tournamentPresentationHTML;
    translation();
	addNavigatorEventListeners();
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/tournament-presentation")
		{
			let dataTournament = await getTournamentInfo();
			if (dataTournament.tabPlayers.length >= 2)
				loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Tournament Presentation Page', translation, addNavigatorEventListeners, createTableau);
			else
				window.location.replace('/home');
		}
		if (this.window.location.pathname === "/game-page-tournament")
		{
			const tournamentPresentationHTML = generateTournamentPresentation();
			let dataTournament = await getTournamentInfo();
			if (dataTournament)
				replaceContent(this.document.getElementById('app'), tournamentPresentationHTML, "tournament-presentation", `Game Page Tournament`, translation, addNavigatorEventListeners, createTableau);
			else
				window.location.replace('/home');
		}
	}
});

async function createTableau()
{	
	let dataTournament = await getTournamentInfo();
	if (dataTournament.numberMatchPlayed == dataTournament.sizeTournament / 2)
	{
		await putTournamentInfoNewRound()
		dataTournament = await getTournamentInfo();
	}
	if (dataTournament.tabPlayers.length < 2)
		window.location.replace('/home');
	let sizeTournament = dataTournament.sizeTournament;
	let tab = dataTournament.tabPlayers;
	let courtColor = dataTournament.courtColor
	let superPower = dataTournament.superPower;
	let tabNewRound = dataTournament.tabPlayersNewRound;
	const tabPresentation = document.getElementById("tab-presentation-tournament-round");
	if (tabPresentation)
	{
		let level;
		if (dataTournament.sizeTournament == 2)
			level = "Final";
		else if (dataTournament.sizeTournament == 4)
			level = "Semi-Final";
		else if (dataTournament.sizeTournament == 8)
			level = "1/4 Final";
		else if (dataTournament.sizeTournament == 16)
			level = "1/8 Final";
		else if (dataTournament.sizeTournament == 32)
			level = "1/16 Final";
		const levelTournament = document.createElement("h2");
		levelTournament.className = "level-tournament";
		levelTournament.textContent = level;
		tabPresentation.appendChild(levelTournament);

		let divTableau;
		for (let i = 0; i < sizeTournament; i+=2)
		{
			if (i % 4 == 0 || i == 0)
			{
				divTableau = document.createElement("div");
				divTableau.className = "divTableau";
				tabPresentation.appendChild(divTableau);
			}
			const divMatch = document.createElement("div");
			divMatch.className = `match`;
			divMatch.classList.add("btn");
			divMatch.classList.add("btn-primary");
			divMatch.classList.add("btn-block");
			divMatch.style.width = "20%";
			divMatch.style.marginTop = "0";
			divMatch.id = `match${i + 1}`;
			const playerTab1 = document.createElement("p");
			playerTab1.className = "playerTab";
			playerTab1.id = `playerTab${i + 1}`;
			playerTab1.textContent = `${tab[i][0]}`;
			playerTab1.style.color = "white";
			const playerTab2 = document.createElement("p");
			playerTab2.className = "playerTab";
			playerTab2.id = `playerTab${i + 2}`;
			playerTab2.textContent = `${tab[i + 1][0]}`;
			playerTab2.style.color = "white";
			const hr = document.createElement("hr");
			hr.style.border = "1px solid white";
			hr.style.margin = "3px 0";
			divMatch.appendChild(playerTab1);
			divMatch.appendChild(hr);
			divMatch.appendChild(playerTab2);
			divTableau.appendChild(divMatch);
			checkUsername(tab, i, divMatch, courtColor, sizeTournament, superPower, tabNewRound);

			const buttonMatch = document.getElementById(`match${i + 1}`);
			if (buttonMatch)
			{
				if (buttonMatch.classList.contains("btn-primary"))
				{
					buttonMatch.addEventListener("mouseover", () => {
						document.getElementById(`playerTab${i + 1}`).textContent = "PLAY";
						document.getElementById(`playerTab${i + 2}`).textContent = "GAME";
					});

					buttonMatch.addEventListener("mouseout", () => {
						document.getElementById(`playerTab${i + 1}`).textContent = `${tab[i][0]}`;
						document.getElementById(`playerTab${i + 2}`).textContent = `${tab[i + 1][0]}`;
					});
				}
			}
		}
	}
}

function checkUsername(tab, inc, div, courtColor, sizeTournament, superPower, tabNewRound)
{
	let usernameFound
	if (tabNewRound && tabNewRound.length > 0)
	{
		const paragraphs = div.querySelectorAll("p");
		if (paragraphs.length === 0) {
			console.error("Aucun paragraphe trouvé dans la div.");
			return;
		}
  		usernameFound = false;
		  paragraphs.forEach((p) => {
			for (let i = 0; i < tabNewRound.length; i++) {
				if (tabNewRound[i] && Array.isArray(tabNewRound[i]) && tabNewRound[i][0] === p.textContent) {
					div.classList.remove("btn-primary");
					div.classList.add("btn-danger");
					let childrenOfDiv = div.querySelectorAll('p');
					let firstChild = childrenOfDiv[0];
					firstChild.textContent = `${tabNewRound[i][0]}`
					let lastChild = childrenOfDiv[1];
					lastChild.textContent = "WON";
					usernameFound = true; // Une correspondance a été trouvée
					return; // Arrête la recherche
				}
			}
		});
	}
	else
		usernameFound = false;
	if (!usernameFound)
	{
		div.addEventListener(('click'), async function() {
			await putMatchInfo(tab[inc][0], tab[inc + 1][0], courtColor, tab[inc][2], tab[inc + 1][2], tab[inc][1], tab[inc + 1][1], "multiplayer", sizeTournament, "tournament-multi-local", superPower);
		});
	}
}

function generateTournamentPresentationHTML()
{
    return `
    	<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
        <div class="tournament-presentation-container">
            <h1 data-translate-key="tournament"></h1>
			<div class="tab-presentation-tournament-round" id="tab-presentation-tournament-round"></div>
        </div>
    `;
}

function generateTournamentPresentation()
{
    let nav = generateNavigator();
	let body = generateTournamentPresentationHTML();

	return (nav + body);
}