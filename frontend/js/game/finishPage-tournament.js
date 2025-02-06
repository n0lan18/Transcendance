import { loadHomePage } from "../home.js";
import { loadPreparationTournamentGamePage } from "../preparation-tournament-game-page.js";
import { translation } from "../translate.js";
import { loadContent, removeTournament } from "../utils.js";


export async function loadFinishPageTournament()
{
	let finishPage = finishPageHTML();

	loadContent(document.getElementById("app"), finishPage, 'finish-page-tournament-win', true, "Finish Page Tournament Win", translation, "", addEventListenerFinishPageTournament);

	document.getElementById("app").innerHTML = finishPage;
	translation();
}

window.addEventListener('popstate', function(event) {
	if (event.state && event.state.page)
		if (this.window.location.pathname === "/finish-page-tournament-win")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, "Finish Page Tournament Win", translation, "", addEventListenerFinishPageTournament);
});

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

function finishPageHTML()
{
	let GameStr;
	const lang = localStorage.getItem('language') || 'en';
	if (lang == "en")
		GameStr = `Congratulations ! The tournament is finished`
	else if (lang == "es")
		GameStr = `¡Felicitaciones! ¡El torneo ha terminado!`
	else if (lang == "fr")
		GameStr = `Felicitations ! Le tournoi est termine`

	return `
		<div class="finish-page" id="finish-page">
			<div class="message-change-orientation">
				<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
				<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
			</div>
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