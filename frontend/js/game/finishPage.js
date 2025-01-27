import { loadHomePage } from "../home.js";
import { loadPreparationSimpleMatchGamePage } from "../preparation-simple-match-game-page.js";
import { translation } from "../translate.js";
import { getMatchInfo, loadContent } from "../utils.js";

export async function loadFinishPage()
{
	const finishPage = finishPageHTML();

	loadContent(document.getElementById("app"), finishPage, "finish-page-single-match", true, 'Finish Page Single match', translation, "", addEventListenerFinishPageSimpleMatch);
	document.getElementById("app").innerHTML = finishPage;

	translation();
	addEventListenerFinishPageSimpleMatch();
}

window.addEventListener('popstate', async function(event) {

	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/finish-page-single-match")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Finish Page Single match', translation, "", addEventListenerFinishPageSimpleMatch);
	}
});

function addEventListenerFinishPageSimpleMatch()
{
	const homeButtonFinishPage = document.getElementById("home-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadHomePage();
	});

	const retryButtonFinishPage = document.getElementById("retry-button-end-party");
	retryButtonFinishPage.addEventListener('click', async function (event) {
		event.preventDefault();
		const matchInfo = await getMatchInfo();
		if (matchInfo.modeGame == "multiPlayerTwo")
			loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerTwo");
		else if (matchInfo.modeGame == "multiPlayerFour")
			loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerFour");
	});
}

export function finishPageHTML()
{
	let GameStr;
	const lang = localStorage.getItem('language') || 'en';
	if (lang == "en")
		GameStr = `Congratulations ! The match is finished`
	else if (lang == "es")
		GameStr = `¡Felicitaciones! ¡El partido ha terminado!`
	else if (lang == "fr")
		GameStr = `Felicitations ! Le match est termine`
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
					<i class="fa-solid fa-rotate-right retry-button-finish-page" style="font-size: 100px;"></i>
					<div class="item-name"
						<h1 data-translate-key="retry"></p>
					</div>
				</button>
			</div>
		<div>
	`;
}