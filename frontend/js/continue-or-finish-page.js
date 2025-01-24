import { loadPreparationTournamentGamePage } from "./preparation-tournament-game-page.js";
import { loadContent, removeTournament } from "./utils.js";
import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";
import { translation } from "./translate.js";


export function loadContinueOrNewTournamentPage()
{
    const continueOrNewTournament = generateContinueOrRemoveTournamentHTML();

    loadContent(document.getElementById('app'), continueOrNewTournament, '/continue-or-new-tournament', true, 'Continue Or New Tournament', translation, addNavigatorEventListeners, addEventListenerContinueOrNewTournament)

    document.getElementById("app").innerHTML = continueOrNewTournament;
    translation();
    addNavigatorEventListeners();

    addEventListenerContinueOrNewTournament();
}

export function addEventListenerContinueOrNewTournament()
{
    const continueTournamentButton = document.getElementById("continue-tournament-button");
    continueTournamentButton.addEventListener('click', function (event) {
        event.preventDefault();
        loadTournamentPresentation("multiplayer", "tournament-multi-local");
    });

    const newTournamentButton = document.getElementById("new-tournament-button");
    newTournamentButton.addEventListener('click', async function (event) {
        event.preventDefault();
        await removeTournament();
        loadPreparationTournamentGamePage("multiplayer", "tournament-multi-local");
    });
}

function ContinueOrFinishTournamentPageHTML()
{
    return `
        <div class="finish-page" id="finish-page">
            <h1 data-translate-key="tournament"></h1>
            <div class="button-finish-page">
                <button id="continue-tournament-button" class="solo-player-simple-match-button">
                    <i class="fa-solid fa-arrow-right-to-bracket home-button-finish-page" style="font-size: 100px; color: white"></i>
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