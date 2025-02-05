import { loadPreparationTournamentGamePage } from "./preparation-tournament-game-page.js";
import { loadContent, removeTournament } from "./utils.js";
import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";
import { translation } from "./translate.js";


export function loadContinueOrNewTournamentPage()
{
    const continueOrNewTournament = generateContinueOrRemoveTournamentHTML();

    loadContent(document.getElementById('app'), continueOrNewTournament, 'continue-or-new-tournament', true, 'Continue Or New Tournament', translation, addNavigatorEventListeners, addEventListenerContinueOrNewTournament)

    document.getElementById("app").innerHTML = continueOrNewTournament;
    translation();
    addNavigatorEventListeners();

    addEventListenerContinueOrNewTournament();
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/continue-or-new-tournament")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Continue Or New Tournament', translation, addNavigatorEventListeners, addEventListenerContinueOrNewTournament);
	}
});

export async function addEventListenerContinueOrNewTournament()
{
    const continueTournamentButton = document.getElementById("continue-tournament-button");
    continueTournamentButton.addEventListener('click', function (event) {
        event.preventDefault();
        loadTournamentPresentation();
    });

    const newTournamentButton = document.getElementById("new-tournament-button");
    newTournamentButton.addEventListener('click', async function (event) {
        event.preventDefault();
        await removeTournament();
        loadPreparationTournamentGamePage();
    });
}

function ContinueOrFinishTournamentPageHTML()
{
    return `
        <div class="finish-page-tournament" id="finish-page">
            <h1 data-translate-key="tournament"></h1>
            <div class="continue-or-new-tournament-page">
                <button id="continue-tournament-button" class="solo-player-simple-match-button">
                    <i class="fa-solid fa-arrow-right-to-bracket" style="font-size: 100px; color: white"></i>
                    <div class="item-name">
                        <h1 data-translate-key="continue-tournament"></h1>
                    </div>
                </button>
                <button id="new-tournament-button" class="solo-player-simple-match-button" style="background-color: #1982c4">
                    <i class="fa-regular fa-file" style="font-size: 100px;"></i>
                    <div class="item-name">
                        <h1 data-translate-key="new-tournament"></h1>
                    </div>
                </button>
            </div>
        </div>
    `;
}

export function generateContinueOrRemoveTournamentHTML()
{
    let nav = generateNavigator();
    let body = ContinueOrFinishTournamentPageHTML()

    return (nav + body);
}