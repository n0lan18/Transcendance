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
	let homeStr = "Home";


	return `
		<div class="finish-page" id="finish-page">
			<h1 data-translate-key="finish"></h1>
			<h2>${GameStr}</h2>
			<div class="button-finish-page">
				<button id="home-button-end-party" class="button-center-items home-button-end-party" style="color: white">
					<i class="fa-solid fa-house home-button-finish-page" style="color: white"></i>
					<p style="font-size: 20px">${homeStr}</p>
				</button>
				<button id="retry-button-end-party" class="button-center-items retry-button-end-party" style="color: white">
					<i class="fa-solid fa-rotate-right retry-button-finish-page" style="color: white"></i>
					<p style="font-size: 20px" data-translate-key="retry"></p>
				</button>
			</div>
		<div>
	`;
}