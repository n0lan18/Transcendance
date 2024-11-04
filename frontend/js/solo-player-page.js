import { loadPreparationSimpleMatchGamePage } from "./preparation-simple-match-game-page.js";
import { loadPreparationTournamentGamePage} from "./preparation-tournament-game-page.js";

export function loadSoloPlayerPageChoiceGame()
{
	document.getElementById("app").innerHTML = soloPlayerPageChoiceGameHTML();

	const simpleMatch = document.getElementById("solo-player-simple-match-button");
	simpleMatch.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationSimpleMatchGamePage();
	});

	const tournament = document.getElementById("solo-player-tournament-button");
	tournament.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationTournamentGamePage();
	});
}

function soloPlayerPageChoiceGameHTML()
{
	let choiceGame = "Chose the game";
	let simpleMatchStr = "Simple match";
	let tournamentStr = "Tournament";

	return `
		<div class="solo-player-choice-game-container">
			<h1>${choiceGame}</h1>
			<div class="solo-player-choice-button">
				<button id="solo-player-simple-match-button" class="solo-player-simple-match-button">
					<i class="fa-solid fa-gamepad" style="font-size: 100px"></i>
					<div class="item-name"
						<h1>${simpleMatchStr}</h1>
					</div>
				</button>
				<button id="solo-player-tournament-button" class="solo-player-tournament-button">
					<i class="fa-solid fa-trophy" style="font-size: 100px"></i>
					<div class="item-name"
						<h1 >${tournamentStr}</h1>
					</div>
				</button>
			</div>
		</div>
	`;
}