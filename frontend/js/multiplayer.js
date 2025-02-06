import { loadPreparationSimpleMatchGamePage } from "./preparation-simple-match-game-page.js";
import { translation } from "./translate.js";
import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";

export function loadMultiPlayerPageChoiceGame()
{
	document.getElementById("app").innerHTML = generateSoloPlayerChoicePageHTML();
	translation();
	addNavigatorEventListeners()

	const simpleMatch = document.getElementById("multi-player-two-players-button");
	simpleMatch.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerTwo");
	});

	const tournament = document.getElementById("multi-player-four-players-button");
	tournament.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationSimpleMatchGamePage("multiplayer", "multiPlayerFour");
	});
}

function soloPlayerPageChoiceGameHTML()
{
	return `
		<div class="multi-player-choice-number-players">
			<h1 class="text-center" data-translate-key="multiplayer"></h1>
			<div class="button-finish-page">
				<button id="multi-player-two-players-button" class="solo-player-simple-match-button">
					<img class="img-box4-5" src="../images/multiplayer-logo-2-players-white.png" alt="two player multiplayer" width="100" height="100">
					<div class="item-name"
						<h1 data-translate-key="twoPlayers"></h1>
					</div>
				</button>
				<button id="multi-player-four-players-button" class="solo-player-tournament-button">
					<img class="img-box4-5" src="../images/multiplayer-logo-4-players-white.png" alt="four player multiplayer" width="100" height="100">
					<div class="item-name"
						<h1 data-translate-key="fourPlayers"></h1>
					</div>
				</button>
			</div>
		</div>
	`;
}

export function generateSoloPlayerChoicePageHTML()
{
	let nav = generateNavigator();
	let body = soloPlayerPageChoiceGameHTML()

	return (nav + body);
}