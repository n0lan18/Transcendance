import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { getTournamentInfo, loadContent } from "./utils.js";
import { translation } from "./translate.js";
import { generateNavigator } from "./nav.js";
import { loadPresentationMultiLocalPlayerPage } from "./presentation-match-multi-local-tournament.js";
import { putTournamentInfoNewRound } from "./utils.js";

export async function loadTournamentPresentation(typeOfGame, modeGame)
{
	let dataTournament = await getTournamentInfo();
	console.log(dataTournament.numberMatchPlayed)
	if (dataTournament.numberMatchPlayed == dataTournament.sizeTournament / 2)
	{
		putTournamentInfoNewRound(dataTournament.sizeTournament, dataTournament.numberMatchPlayed, dataTournament.tabPlayersNewRound)
		dataTournament = await getTournamentInfo();
	}
	console.log(dataTournament.tabPlayersNewRound)
	const tournamentPresentationHTML = generateTournamentPresentation();

    loadContent(tournamentPresentationHTML, "tournament-presentation", true);

	document.getElementById("app").innerHTML = tournamentPresentationHTML;
    translation();
	addNavigatorEventListeners();

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
	}
	createTableau(dataTournament.sizeTournament, dataTournament.tabPlayers, dataTournament.courtColor, dataTournament.superPower, typeOfGame, modeGame, dataTournament.numberMatch, dataTournament.tabPlayersNewRound);

}

function createTableau(sizeTournament, tab, courtColor, superPower, typeOfGame, modeGame, numberMatch, tabNewRound)
{
	const tabPresentation = document.getElementById("tab-presentation-tournament-round");
	if (tabPresentation)
	{
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
			checkUsername(tab, i, divMatch, courtColor, sizeTournament, typeOfGame, modeGame, superPower, numberMatch, tabNewRound);

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

function checkUsername(tab, inc, div, courtColor, sizeTournament, typeOfGame, modeGame, superPower, numberMatch, tabNewRound)
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
					console.log(tabNewRound[i]);
					console.log(p.textContent);
					div.classList.remove("btn-primary");
					div.classList.add("btn-danger");
					document.getElementById(`playerTab${i + 1}`).textContent = `${tabNewRound[i][0]}`;
					document.getElementById(`playerTab${i + 2}`).textContent = "WON";
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
		div.addEventListener(('click'), function() {
			loadPresentationMultiLocalPlayerPage(tab[inc][0], tab[inc + 1][0], courtColor, tab[inc][2], tab[inc + 1][2], tab[inc][1], tab[inc][1], sizeTournament, typeOfGame, modeGame, superPower, numberMatch, tab, tabNewRound);
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