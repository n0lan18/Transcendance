import { loadHomePage } from "../home.js";
import { loadPreparationTournamentGamePage } from "../preparation-tournament-game-page.js";
import { translation } from "../translate.js";
import { putStatsInfo } from "../utils.js";
import { getUserInfo } from "../utils.js";
import { removeTournament } from "../utils.js";


export async function loadFinishPageTournament(username1, username2, numberPlayer, scoreLeftPlayer, scoreRigthPlayer)
{
	let userInfo = await getUserInfo();
	await putStatsInfo(6, {numberMatchTournament: 1});
	if ((userInfo.username == username1 && scoreLeftPlayer > scoreRigthPlayer) || (userInfo.username == username2 && scoreRigthPlayer > scoreLeftPlayer))
	{
		await putStatsInfo(7, {numberVictoryMatchTournament: 1})
		await putStatsInfo(8, {numberVictoryTournament: 1})
		await putStatsInfo(2, {resultats: "V"})
		if (scoreLeftPlayer > scoreRigthPlayer)
		{
			await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreRigthPlayer})
		}
		else
		{
			await putStatsInfo(13, {numberGoalsWin: scoreRightPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreLeftPlayer})
		}
	}
	else
	{
		await putStatsInfo(2, {resultats: "D"})
		if (scoreLeftPlayer > scoreRigthPlayer)
		{
			await putStatsInfo(13, {numberGoalsWin: scoreRightPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreLeftPlayer})
		}
		else
		{
			await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreRigthPlayer})
		}
	}
	if (numberPlayer == 1)
		numberPlayer = 2;
	await putStatsInfo(15, {bestResultTournament: numberPlayer})
	await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRigthPlayer})
	let finishPage
	if (scoreLeftPlayer > scoreRigthPlayer)
		finishPage = finishPageHTML(username1);
	else
		finishPage = finishPageHTML(username2);
	document.getElementById("app").innerHTML = finishPage;
	translation();

	await removeTournament();

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

function finishPageHTML(sideWin)
{
	let GameStr;
	const lang = localStorage.getItem('language') || 'en';
	if (lang == "en")
		GameStr = `Congratulations ! ${sideWin} won the tournament`
	else if (lang == "es")
		GameStr = `${sidewin} ganado el torneo`
	else if (lang == "fr")
		GameStr = `${sideWin} gagne le tournoi`

	return `
		<div class="finish-page" id="finish-page">
			<h1 data-translate-key="finish"></h1>
			<h2>${GameStr}</h2>
			<div class="button-finish-page">
				<button id="home-button-end-party" class="solo-player-simple-match-button">
					<i class="fa-solid fa-house home-button-finish-page" style="font-size: 100px; color: white"></i>
					<div class="item-name">
						<h1 data-translate-key="home"></h1>
					</div>
				</button>
				<button id="retry-button-end-party" class="solo-player-simple-match-button" style="background-color: #1982c4">
					<i class="fa-solid fa-rotate-right" style="font-size: 100px;"></i>
					<div class="item-name">
						<h1 data-translate-key="retry"></h1>
					</div>
				</button>
			</div>
		</div>
	`;
}