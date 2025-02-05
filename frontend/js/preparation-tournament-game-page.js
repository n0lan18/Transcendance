import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { generateNavigator } from "./nav.js";
import { loadUsernamePlayersTournament } from "./username-players-tournament.js";
import { translation } from "./translate.js";
import { putTournamentInfoBasic } from "./utils.js";
import { loadContent,  } from "./utils.js";
import { rgbToHex } from "./utils.js";

export async function loadPreparationTournamentGamePage()
{
	const preparationGameHTML = generatePreparationSoloTournamentPageHTML();
	
	addNavigatorEventListeners();

	loadContent(document.getElementById("app"), preparationGameHTML, "preparation-solo-tournament", true, 'Preparation Tournament', translation, addNavigatorEventListeners, addEventListenerPreparationTournament);
	document.getElementById("app").innerHTML = preparationGameHTML;
	translation();
	addNavigatorEventListeners();

	addEventListenerPreparationTournament()
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/preparation-solo-tournament")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, "Preparation Tournament", translation, addNavigatorEventListeners,  addEventListenerPreparationTournament);
	}
});

export async function addEventListenerPreparationTournament()
{
	let courtColor = "#CF5A30";
	let colorPlayer1 = "#E23F22";
	let sizeTournament = 32;
	let superPower = "isSuperPower";

	document.querySelectorAll('.color-button-player1').forEach(button => {
		button.addEventListener('click', (event) => {
			event.stopPropagation();
			document.querySelectorAll('.color-button-player1').forEach(button => {
				button.style.border = "none";
			});
			event.target.style.border = "3px solid #ffffff";
			let color = event.target.style.backgroundColor;
			colorPlayer1 = rgbToHex(color);
			const colorPickerContainer1 = document.getElementById("color-picker-container1");
			const colorPicker1 = document.getElementById("color-picker-player1");
			colorPickerContainer1.style.backgroundColor = colorPicker1.value;
		});
	});
	let colorPicker1 = document.getElementById("color-picker-player1");
	if (colorPicker1)
	{
		colorPicker1.addEventListener('input', function (event) {
			colorPlayer1 = event.target.value;
			const colorPickerContainer1 = document.getElementById("color-picker-container1");
			colorPickerContainer1.style.backgroundColor = "#ffffff";
			document.querySelectorAll('.color-button-player1').forEach(button => {
				button.style.border = "none";
			});
		});
	}

	document.querySelectorAll('.players-button').forEach(button => {
		button.addEventListener('click', (event) => {
			event.stopPropagation();
			document.querySelectorAll('.players-button').forEach(button => {
				button.style.border = "none";
			});
			event.currentTarget.style.border = "3px solid #ffffff";
			let idPlayer = event.currentTarget.id;
			switch (idPlayer) {
				case "players-button-32":
					sizeTournament = 32;
					break;
				case "players-button-16":
					sizeTournament = 16;
					break;
				case "players-button-8":
					sizeTournament = 8;
					break;
				case "players-button-4":
					sizeTournament = 4;
					break;
			} 
		});
	});

	let sendPreparationGameButton = document.getElementById("send-preparation-game-button");
	if (sendPreparationGameButton)
	{
		sendPreparationGameButton.addEventListener('click', async function (event) {
			if (courtColor === undefined)
			{
				const environnementPreparationContainer = document.getElementById("environnement-preparation-container");
				if (!document.getElementById("error-message"))
				{
					const errorMessage = document.createElement("p");
					errorMessage.id = "error-message";
					errorMessage.textContent = "Please choose a court color";
					errorMessage.classList.add("invalid-register");
					environnementPreparationContainer.appendChild(errorMessage);
					const sendPreparationGameButton = document.getElementById("send-preparation-game-button");
					sendPreparationGameButton.classList.remove("btn-success");
					sendPreparationGameButton.classList.add("btn-danger");
				}
			}
			else
				await putTournamentInfoBasic(courtColor, sizeTournament, superPower);
		});
	}

	const buttons = document.querySelectorAll('.btn-court');
	buttons.forEach(button => {
		button.addEventListener('click', function (event) {
			event.stopPropagation();
			document.querySelectorAll('.btn-court').forEach(button => {
				button.style.border = "none";
			});
			event.currentTarget.style.border = "3px solid #ffffff";
			event.currentTarget.style.borderRadius = "10px";
			let buttonId = event.currentTarget.id;

			switch (buttonId) {
				case "environnement-preparation-container-button-orange":
					courtColor = "#CF5A30";
					break;
				case "environnement-preparation-container-button-dark-blue":
					courtColor = "#043976";
					break;
				case "environnement-preparation-container-button-light-blue":
					courtColor = "#0183CB";
					break;
				case "environnement-preparation-container-button-green":
					courtColor = "#689D63";
					break;
				case "environnement-preparation-container-button-random":
					const strings = ["#CF5A30", "#043976", "#0183CB", "#689D63"];
					courtColor = strings[Math.floor(Math.random() * strings.length)];
					break;
				default :
					courtColor = "#CF5A30";
			}
		});
	});

	const images = [
		"../images/super1.png",
		"../images/super2.png",
		"../images/super3.png",
		"../images/super4.png",
	];

	const radios = document.querySelectorAll('input[name="choice"]');
	radios.forEach(radio => {
		radio.addEventListener('change', () => {
			if (radio.checked) {
				let superHeroContainer = document.getElementById("superhero-container1");
				if (radio.value == "isSuperPower")
				{
					superHeroContainer.style.display = "inline";
					superPower = "isSuperPower";
				}
				else
				{
					superHeroContainer.style.display = "none";
					superPower = "isNotSuperPower";
				}
			}
		})
	})
}

function generatePreparationTournamentGamePageHTML()
{
	let numberPlayer = 64;
	let number = Math.floor(Math.random() * 4) + 1;
	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="preparation-game-container" id="preparation-game-container">
			<h1 data-translate-key="tournament"></h1>
			<div class="radio-superPower">
    			<div class="radio-isSuperPower">
        			<input type="radio" id="isSuperPower" name="choice" value="isSuperPower" checked>
        			<label for="isSuperPower" data-translate-key="isSuperPower">Avec Super-pouvoirs</label>
    			</div>
    			<div class="radio-isNotSuperPower">
        			<input type="radio" id="isNotSuperPower" name="choice" value="isNotSuperPower">
        			<label for="isNotSuperPower" data-translate-key="isNotSuperPower">Sans Super-pouvoirs</label>
    			</div>
			</div>
			<div class="player-preparation-container">
				<div class="player-preparation-container-content">
					<div class="player-left-preparation">
						<div class="superhero-container" id="superhero-container1">
							<div class="chose-superhero-container" id="chose-superhero-container1">
								<img id="superhero-image" class="superhero-image" src="../images/super${number}.png" alt="Photo Album" style="width: 40%; height: 40%; border-radius: 10px;">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="number-players-tournament">
				<h3 data-translate-key="numberPlayers"></h3>
				<div class="number-players-tournament-buttons">
					<button id="players-button-32" class="players-button players-button-32" style="background-color: #8ac926">
						<p class="string-plyers-button">${numberPlayer /= 2}</p>
					</button>
					<button id="players-button-16" class="players-button players-button-16" style="background-color: #e03f27">
						<p class="string-plyers-button">${numberPlayer /= 2}</p>
					</button>
					<button id="players-button-8" class="players-button players-button-8" style="background-color: #1982c4">
						<p class="string-plyers-button">${numberPlayer /= 2}</p>
					</button>
					<button id="players-button-4" class="players-button players-button-4" style="background-color: #ffca3a">
						<p class="string-plyers-button">${numberPlayer /= 2}</p>
					</button>
				</div>
			</div>
			<div class="environnement-preparation-container" id="environnement-preparation-container">
				<h3 data-translate-key="environnement"></h3>
				<div class="environnement-preparation-container-button">
					<button id="environnement-preparation-container-button-orange" class="environnement-preparation-container-button-orange btn-court" style="border: 3px solid #ffffff; border-radius: 10px">
						<img style="width: 100%; height: 100%; border-radius: 10px;" src="../images/orange-court.png" alt="Orange court">
					</button>
					<button id="environnement-preparation-container-button-dark-blue" class="environnement-preparation-container-button-dark-blue btn-court">
						<img style="width: 100%; height: 100%; border-radius: 10px;" src="../images/dark-blue-court.png" alt="Dark blue court">
					</button>
					<button id="environnement-preparation-container-button-light-blue" class="environnement-preparation-container-button-light-blue btn-court">
						<img style="width: 100%; height: 100%; border-radius: 10px;" src="../images/light-blue-court.png" alt="Light blue court">
					</button>
					<button id="environnement-preparation-container-button-green" class="environnement-preparation-container-button-green btn-court">
						<img style="width: 100%; height: 100%; border-radius: 10px;" src="../images/green-court.png" alt="Green court">
					</button>
				</div>
				<div class="environnement-preparation-random-button">
					<button id="environnement-preparation-container-button-random" class="environnement-preparation-container-button-random btn-court">
						<div class="random-court-container">
							<img style="width: 100%; height: 100%; border-radius: 10px;" src="../images/random-court.png" alt="Random court">
							<h3 class="random-court-text">Random</h3>
						</div>
					</button>
				</div>
			</div>
			<input id="send-preparation-game-button" data-translate-key="start" value="" class="btn btn-success btn-block mb-4 send-preparation-game-button" style="width: 30%;">
		</div>
	`;
}

export function generatePreparationSoloTournamentPageHTML()
{
	let nav = generateNavigator();
	let body = generatePreparationTournamentGamePageHTML();

	return (nav + body);
}