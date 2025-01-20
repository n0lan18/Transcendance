import { loadPresentationSoloPlayerPage } from "../presentation-match-solo-tournament.js";
import { translation } from "../translate.js";
import { putStatsInfo } from "../utils.js";
import { getUserInfo } from "../utils.js";
import { loadTournamentPresentation } from "../tournament-presentation.js";

export async function loadFinishPageTournamentWin(username1, courtColor, numberPlayers, scoreLeftPlayer, scoreRightPlayer, typeOfGame, modeGame, superPower, tab, numberMatch, tabNewRound)
{
	console.log(tabNewRound);
	let userInfo = await getUserInfo();
	if (userInfo.username == username1)
	{
		await putStatsInfo(7, {numberVictoryMatchTournament: 1})
		await putStatsInfo(2, {resultats: "V"})
		await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
		await putStatsInfo(14, {numberGoalLose: scoreRightPlayer})
		await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRightPlayer})
	}
	document.getElementById("app").innerHTML = finishPageHTML(numberPlayers);
	translation();


	const homeButtonFinishPage = document.getElementById("continue-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadTournamentPresentation(tab, courtColor, numberPlayers, typeOfGame, modeGame, superPower, numberMatch, tabNewRound)
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