import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { loadContent } from "./utils.js";
import { translation } from "./translate.js";
import { generateNavigator } from "./nav.js";
import { loadPresentationMultiLocalPlayerPage } from "./presentation-match-multi-local-tournament.js";

export function loadTournamentPresentation(tab, courtColor, sizeTournament, sizePlayers, superPower, numberMatch, tabNewRound)
{
	if (numberMatch == sizeTournament / 2)
	{
		sizeTournament /= 2;
		numberMatch /= sizeTournament;
		tab = tabNewRound;
		tabNewRound = [];
	}
	console.log(tabNewRound);
	const tournamentPresentationHTML = generateTournamentPresentation();

    loadContent(tournamentPresentationHTML, "tournament-presentation", true);

	document.getElementById("app").innerHTML = tournamentPresentationHTML;
    translation();
	addNavigatorEventListeners();

	const tabPresentation = document.getElementById("tab-presentation-tournament-round");
	if (tabPresentation)
	{
		let level;
		if (sizeTournament == 2)
			level = "Final";
		else if (sizeTournament == 4)
			level = "Semi-Final";
		else if (sizeTournament == 8)
			level = "1/4 Final";
		else if (sizeTournament == 16)
			level = "1/8 Final";
		else if (sizeTournament == 32)
			level = "1/16 Final";
		const levelTournament = document.createElement("h2");
		levelTournament.className = "level-tournament";
		levelTournament.textContent = level;
		tabPresentation.appendChild(levelTournament);
	}
	createTableau(sizeTournament, tab, courtColor, superPower, sizePlayers, numberMatch, tabNewRound);
}

function createTableau(sizeTournament, tab, courtColor, superPower, sizePlayers, numberMatch, tabNewRound)
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
			divMatch.id = `match${i + 1}`;
			const playerTab1 = document.createElement("p");
			playerTab1.className = "playerTab";
			playerTab1.id = `playerTab${i + 1}`;
			playerTab1.textContent = `${tab[i][0]}`;
			const playerTab2 = document.createElement("p");
			playerTab2.className = "playerTab";
			playerTab2.id = `playerTab${i + 2}`;
			playerTab2.textContent = `${tab[i + 1][0]}`;
			divMatch.appendChild(playerTab1);
			divMatch.appendChild(playerTab2);
			divTableau.appendChild(divMatch);
			console.log(document.getElementById(`match${i + 1}`));
			checkUsername(tab, i, divMatch, courtColor, sizeTournament, sizePlayers, superPower, numberMatch, tabNewRound);
		}
	}
}

function checkUsername(tab, inc, div, courtColor, sizeTournament, sizePlayers, superPower, numberMatch, tabNewRound)
{
	let usernameFound
	if (tabNewRound.length > 0)
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
					div.style.backgroundColor = "red";
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
		div.addEventListener(('click'), function(event, sizePlayers) {
			loadPresentationMultiLocalPlayerPage(tab[inc][0], tab[inc + 1][0], courtColor, tab[inc][2], tab[inc + 1][2], tab[inc][1], tab[inc][1], sizeTournament, sizePlayers, superPower, numberMatch, tab, tabNewRound);
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