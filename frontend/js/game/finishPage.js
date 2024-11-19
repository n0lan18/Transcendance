import { loadHomePage } from "../home.js";
import { loadPreparationSimpleMatchGamePage } from "../preparation-simple-match-game-page.js";
import { translation } from "../translate.js";
import { putStatsInfo } from "../utils.js";

export async function loadFinishPage(winOrLostStr, scoreLeftPlayer, scoreRightPlayer, isWin, styleGame, modeGame)
{
	if (styleGame != "multiplayer")
	{
		if (isWin == true)
		{
			await putStatsInfo(2, {resultats: "V"})
			await putStatsInfo(4, {numberVictorySimpleMatch: 1})
		}
		else
			await putStatsInfo(2, {resultats: "D"})
		await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
		await putStatsInfo(14, {numberGoalLose: scoreRightPlayer})
		await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRightPlayer})
	}
	document.getElementById("app").innerHTML = finishPageHTML(winOrLostStr);
	translation();

	const homeButtonFinishPage = document.getElementById("home-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadHomePage();
	});

	const retryButtonFinishPage = document.getElementById("retry-button-end-party");
	retryButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		if (modeGame == "multiPlayerTwo")
			loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerTwo");
		else if (modeGame == "multiPlayerFour")
			loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerFour");
		else
			loadPreparationSimpleMatchGamePage("simple-match", "soloPlayer");
	});
}

function finishPageHTML(winOrLostStr)
{
	return `
		<div class="finish-page" id="finish-page">
			<h1 data-translate-key="finish"></h1>
			<h2>${winOrLostStr}</h2>
			<div class="button-finish-page">
				<button id="home-button-end-party" class="solo-player-simple-match-button">
					<i class="fa-solid fa-house home-button-finish-page" style="font-size: 100px; color: white"></i>
					<div class="item-name"
						<h1 data-translate-key="home"></h1>
					</div>
				</button>
				<button id="retry-button-end-party" class="solo-player-tournament-button" style="background-color: #1982c4">
					<i class="fa-solid fa-rotate-right retry-button-finish-page" style="font-size: 100px;"></i>
					<div class="item-name"
						<h1 data-translate-key="retry"></p>
					</div>
				</button>
			</div>
		<div>
	`;
}