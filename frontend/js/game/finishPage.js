import { loadHomePage } from "../home.js";
import { loadPreparationSimpleMatchGamePage } from "../preparation-simple-match-game-page.js";
import { translation } from "../translate.js";
import { getHistoryMatches, getMatchInfo, loadContent } from "../utils.js";

export async function loadFinishPage()
{
	const finishPage = await finishPageHTML();

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

export async function finishPageHTML()
{
	let GameStr;
	const lang = localStorage.getItem('language') || 'en';
	if (lang == "en")
		GameStr = `Congratulations ! The match is finished`
	else if (lang == "es")
		GameStr = `¡Felicitaciones! ¡El partido ha terminado!`
	else if (lang == "fr")
		GameStr = `Felicitations ! Le match est termine`

	const matchData = await getHistoryMatches();

	let totalSecondes = matchData[matchData.length - 1].dureeMatch / 1000
	let minute = Math.floor(totalSecondes / 60);
	let seconds = (totalSecondes % 60).toFixed(0);

	const heroImages = {
		"Invisible": "../images/super1.png",
		"Duplication": "../images/super2.png",
		"Super strength": "../images/super3.png",
		"Time laps": "../images/super4.png"
	};

	const imagePlayer1 = heroImages[matchData[matchData.length - 1].heroPlayer1] || "../images/default.png";
	const imagePlayer2 = heroImages[matchData[matchData.length - 1].heroPlayer2] || "../images/default.png";

	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="finish-page" id="finish-page">
			<h1 data-translate-key="finish"></h1>
			<h2>${GameStr}</h2>
			<div class="endmatch-container" id="endmatch-container">
                <div class="recap-match-finish-page">
                    <div class="recap-match-finish" id="recap-match">
                        <div class="recap-match-user1">
                            <img id="img-friends1" class="superhero-image" src="${imagePlayer1}" alt="Profile image" style="width: 100px; height: 100px; border-radius: 10px;">
                            <h2 style="margin-left: 5px;">${matchData[matchData.length - 1].username1 || "Unknown Player 1"}</h2>
                        </div>
                        <h2 class="recap-match-scores">${matchData[matchData.length - 1].scores || "0-0"}</h2>
                        <div class="recap-match-user2">
                            <h2 style="margin-right: 5px;">${matchData[matchData.length - 1].username2 || "Unknown Player 2"}</h2>
                            <img id="img-friends2" class="superhero-image" src="${imagePlayer2}" alt="Profile image" style="width: 100px; height: 100px; border-radius: 10px;">
                        </div>
                    </div>
                    <h3 class="date-match-stats">${matchData[matchData.length - 1].dates || "1/1/2025"}</h3>
                </div>
                <div class="statspart-match-page">
                    <div class="statspart">
                        <h2 data-translate-key="winner"></h2>
                        <h3>${matchData[matchData.length - 1].vainqueur || "Player1"}</h3>
                    </div>
                    <div class="statspart">
                        <h2 data-translate-key="duration-match"></h2>
                        <h3>${minute + "min " + seconds + "sec" || "0min 0sec"}</h3>
                    </div>
                    <div class="statspart">
                        <h2 data-translate-key="longest-rally"></h2>
                        <h3>${matchData[matchData.length - 1].echangeLong || "0"}</h3>
                    </div>
                    <div class="statspart">
                        <h2 data-translate-key="number-gamebreaker"></h2>
                        <h3>${matchData[matchData.length - 1].numberGameBreaker || "0"}</h3>
                    </div>
                </div>
				<div class="button-finish-page">
					<button id="home-button-end-party" class="solo-finish-simple-match-button" style="background-color: #8ac926">
						<i class="fa-solid fa-house img-button-finish-page"></i>
						<div class="item-name"
							<h1 data-translate-key="home"></h1>
						</div>
					</button>
					<button id="retry-button-end-party" class="solo-finish-simple-match-button" style="background-color: #1982c4">
						<i class="fa-solid fa-rotate-right img-button-finish-page"></i>
						<div class="item-name"
							<h1 data-translate-key="retry"></h1>
						</div>
					</button>
				</div>
            </div>
		<div>
	`;
}