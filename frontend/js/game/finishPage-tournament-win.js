import { loadPresentationSoloPlayerPage } from "../presentation-match-solo-tournament.js";
import { translation } from "../translate.js";
import { insertWinnerInTabNewRound, loadContent, putStatsInfo, replaceContent } from "../utils.js";
import { getUserInfo } from "../utils.js";
import { loadTournamentPresentation } from "../tournament-presentation.js";

export async function loadFinishPageTournamentWin(numberPlayers,typeOfGame, modeGame)
{	
	const finishPage = finishPageHTML(numberPlayers);

	loadContent(document.getElementById('app'), finishPage, 'finish-page-tournament', true, 'Finish Page Tournament', translation, "", () => addEventListenerFinishPageTournament(typeOfGame, modeGame));
	
	document.getElementById("app").innerHTML = finishPageHTML(numberPlayers);
	translation();

	addEventListenerFinishPageTournament(typeOfGame, modeGame);

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page)
		{
			if (window.location.pathname === "/solo-page" || window.location.pathname === "/presentation-solo-tournament")
				replaceContent(document.getElementById('app'), finishPage, 'finish-page-tournament', 'Finish Page Tournament', translation, "", () => addEventListenerFinishPageTournament(typeOfGame, modeGame))
		}
	});
}

function addEventListenerFinishPageTournament(typeOfGame, modeGame)
{
	const homeButtonFinishPage = document.getElementById("continue-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadTournamentPresentation(typeOfGame, modeGame)
	});
}

function finishPageHTML(numberPlayers)
{
	numberPlayers /= 2;
	const lang = localStorage.getItem('language') || 'en';
	let roadToStr;
	if (lang == "fr")
	{
		if (numberPlayers == 4)
			roadToStr = "En route pour la demi finale";
		else if (numberPlayers == 2)
			roadToStr = "En route pour la finale";
		else
			roadToStr ="En route pour 1/" + numberPlayers / 2 + " de finale";
	}
	else if (lang == "en")
	{
		if (numberPlayers == 4)
			roadToStr = "Road to Semi final";
		else if (numberPlayers == 2)
			roadToStr = "Road to Final";
		else
		roadToStr ="Road to 1/" + numberPlayers / 2 + " final";
	}
	else if (lang == "es")
	{
		if (numberPlayers == 4)
			roadToStr = "Camino a la semifinal";
		else if (numberPlayers == 2)
			roadToStr = "Camino a la final";
		else
			roadToStr = "Camino a la 1/" + numberPlayers / 2 + " final";
	}

	return `
		<div class="finish-page" id="finish-page">
			<h1 data-translate-key="winMatch"></h1>
			<h2>${roadToStr}</h2>
			<div class="solo-player-choice-button">
				<button id="continue-button-end-party" class="solo-player-simple-match-button" style="background-color: #ffca3a">
					<i class="fa-solid fa-arrow-right-to-bracket" style="font-size: 100px;"></i>
					<div class="item-name"
						<h1 data-translate-key="continue"></h1>
					</div>
				</button>
			</div>
		<div>
	`;
}