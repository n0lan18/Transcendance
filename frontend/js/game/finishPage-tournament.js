import { loadHomePage } from "../home.js";
import { loadPreparationTournamentGamePage } from "../preparation-tournament-game-page.js";
import { addRoute } from "../router.js";
import { translation } from "../translate.js";
import { loadContent, removeTournament } from "../utils.js";


export async function loadFinishPageTournament(username1, username2, scoreLeftPlayer, scoreRigthPlayer)
{
	addRoute('/finish-page-tournament-win', { loadFunction: () => loadFinishPageTournament(username1, username2, scoreLeftPlayer, scoreRigthPlayer)})
	let finishPage
	if (scoreLeftPlayer > scoreRigthPlayer)
		finishPage = finishPageHTML(username1);
	else
		finishPage = finishPageHTML(username2);

	loadContent(document.getElementById("app"), finishPage, 'finish-page-tournament-win', true, "Finish Page Tournament Win", translation, "", addEventListenerFinishPageTournament);

	document.getElementById("app").innerHTML = finishPage;
	translation();

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page)
		{
			loadContent(this.document.getElementById("app"), event.state.page, '', false, "Finish Page Tournament Win", translation, "", addEventListenerFinishPageTournament);
		}
	});
}

async function addEventListenerFinishPageTournament()
{
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