import { loadPreparationSimpleMatchGamePage } from "./preparation-simple-match-game-page.js";
import { loadPreparationTournamentGamePage} from "./preparation-tournament-game-page.js";
import { translation } from "./translate.js";
import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";

export function loadSoloPlayerPageChoiceGame()
{
	document.getElementById("app").innerHTML = generateSoloPlayerChoicePageHTML();
	translation();
	addNavigatorEventListeners()

	const simpleMatch = document.getElementById("solo-player-simple-match-button");
	simpleMatch.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationSimpleMatchGamePage("simple-match", "soloPlayer");
	});

	const tournament = document.getElementById("solo-player-tournament-button");
	tournament.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationTournamentGamePage("soloPlayer");
	});
}

function soloPlayerPageChoiceGameHTML()
{
	return `
		<div class="solo-player-choice-game-container">
			<h1 data-translate-key="choiceGame"></h1>
			<div class="button-finish-page">
				<button id="solo-player-simple-match-button" class="solo-player-simple-match-button">
					<i class="fa-solid fa-gamepad" style="font-size: 100px"></i>
					<div class="item-name"
						<h3 data-translate-key="simpleMatch"></h1>
					</div>
				</button>
				<button id="solo-player-tournament-button" class="solo-player-tournament-button">
					<i class="fa-solid fa-trophy" style="font-size: 100px"></i>
					<div class="item-name"
						<h3 data-translate-key="tournament"></h1>
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