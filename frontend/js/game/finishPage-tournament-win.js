import { loadPresentationSoloPlayerPage } from "../presentation-match-solo-tournament.js";
import { translation } from "../translate.js";
import { putStatsInfo } from "../utils.js";

export async function loadFinishPageTournamentWin(username1, courtColor, colorPlayer1, heroPowerPlayer1, numberPlayers, scoreLeftPlayer, scoreRightPlayer)
{
	await putStatsInfo(7, {numberVictoryMatchTournament: 1})
	await putStatsInfo(2, {resultats: "V"})
	await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
	await putStatsInfo(14, {numberGoalLose: scoreRightPlayer})
	await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRightPlayer})

	document.getElementById("app").innerHTML = finishPageHTML(numberPlayers);
	translation();


	const homeButtonFinishPage = document.getElementById("continue-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadPresentationSoloPlayerPage(username1, courtColor, colorPlayer1, heroPowerPlayer1, numberPlayers)
	});
}

function finishPageHTML(numberPlayers)
{
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
			<div class="button-finish-page">
				<button id="continue-button-end-party" class="button-center-items home-button-end-party" style="color: white">
					<i class="fa-solid fa-arrow-right-to-bracket home-button-finish-page" style="color: white"></i>
					<p style="font-size: 20px" data-translate-key="continue"></p>
				</button>
			</div>
		<div>
	`;
}