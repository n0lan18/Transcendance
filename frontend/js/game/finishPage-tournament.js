import { loadHomePage } from "../home.js";
import { loadPreparationTournamentGamePage } from "../preparation-tournament-game-page.js";
import { translation } from "../translate.js";
import { putStatsInfo } from "../utils.js";


export async function loadFinishPageTournament(endOfGame, numberPlayer, scoreLeftPlayer, scoreRigthPlayer)
{
	if (endOfGame == "win")
	{
		await putStatsInfo(7, {numberVictoryMatchTournament: 1})
		await putStatsInfo(8, {numberVictoryTournament: 1})
		await putStatsInfo(2, {resultats: "V"})
	}
	else
		await putStatsInfo(2, {resultats: "D"})
	if (numberPlayer == 1)
		numberPlayer = 2;
	await putStatsInfo(15, {bestResultTournament: numberPlayer})
	await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
	await putStatsInfo(14, {numberGoalLose: scoreRigthPlayer})
	await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRigthPlayer})

	document.getElementById("app").innerHTML = finishPageHTML(endOfGame);
	translation();

	const homeButtonFinishPage = document.getElementById("home-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadHomePage();
	});

	const retryButtonFinishPage = document.getElementById("retry-button-end-party");
	retryButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationTournamentGamePage()
	});
}

function finishPageHTML(endOfGame)
{
	let GameStr;
	if (endOfGame == "lose")
		GameStr = "Game over !";
	else
	{
		const lang = localStorage.getItem('language') || 'en';
		if (lang == "en")
			GameStr = "You've won the tournament"
		else if (lang == "es")
			GameStr = "YHas ganado el torneo"
		else if (lang == "fr")
			GameStr = "Vous avez gagne le tournoi"
	}


	return `
		<div class="finish-page" id="finish-page">
			<h1 data-translate-key="finish"></h1>
			<h2>${GameStr}</h2>
			<div class="button-finish-page">
				<button id="home-button-end-party" class="solo-player-simple-match-button">
					<i class="fa-solid fa-house home-button-finish-page" style="font-size: 100px; color: white"></i>
					<div class="item-name"
						<h1 data-translate-key="home"></h1>
					</div>
				</button>
				<button id="retry-button-end-party" class="solo-player-tournament-button" style="background-color: #1982c4">
					<i class="fa-solid fa-rotate-right" style="font-size: 100px;></i>
					<div class="item-name"
						<h1 data-translate-key="retry"></p>
					</div>
				</button>
			</div>
		<div>
	`;
}