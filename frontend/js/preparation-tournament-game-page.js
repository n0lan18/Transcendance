import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { generateNavigator } from "./nav.js";
import { loadPresentationSoloPlayerPage } from "./presentation-match-solo-tournament.js";
import { fetchUserInfo } from "./utils.js";
import { loadContent } from "./utils.js";
import { rgbToHex } from "./utils.js";

export async function loadPreparationTournamentGamePage()
{
	let userInfo = await fetchUserInfo();

	let username1 = userInfo.username;
	const preparationGameHTML = generatePreparationSoloTournamentPageHTML();

	addNavigatorEventListeners();

	let courtColor = 0xCF5A30;
	let colorPlayer1 = "#E23F22";
	let heroPowerPlayer1 = "Invisible";
	let sizeTournament = 64;

	loadContent(preparationGameHTML, "preparation-solo-tournament", true);

	document.getElementById("app").innerHTML = preparationGameHTML;

	addNavigatorEventListeners();

	document.querySelectorAll('.color-button-player1').forEach(button => {
		button.addEventListener('click', (event) => {
			event.stopPropagation();
			document.querySelectorAll('.color-button-player1').forEach(button => {
				button.style.border = "none";
			});
			event.target.style.border = "3px solid #ffffff";
			let color = event.target.style.backgroundColor;
			colorPlayer1 = rgbToHex(color);
			console.log(colorPlayer1);
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
				case "players-button-64":
					sizeTournament = 64
					break;
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
		sendPreparationGameButton.addEventListener('click', function (event) {
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
				loadPresentationSoloPlayerPage(username1, courtColor, colorPlayer1, heroPowerPlayer1, sizeTournament);
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
					courtColor = 0xCF5A30;
					break;
				case "environnement-preparation-container-button-dark-blue":
					courtColor = 0x043976;
					break;
				case "environnement-preparation-container-button-light-blue":
					courtColor = 0x0183CB;
					break;
				case "environnement-preparation-container-button-green":
					courtColor = 0x689D63;
					break;
				case "environnement-preparation-container-button-random":
					const strings = [0xCF5A30, 0x043976, 0x0183CB, 0x689D63];
					courtColor = strings[Math.floor(Math.random() * strings.length)];
					break;
				default :
					courtColor = 0xCF5A30;
			}
		});
	});

	const images = [
		"../images/super1.png",
		"../images/super2.png",
		"../images/super3.png",
		"../images/super4.png",
	];

	let currentImageIndex = 0;

	const prevBtn = document.getElementById("left-arrow1");
	if (prevBtn)
	{
		prevBtn.addEventListener('click', (event) => {
			console.log("prevBtn");
			const albumImage = document.getElementById("superhero-image");
			const superheroPlayerText = document.getElementById("superhero-power-text-player1");
			currentImageIndex--;
			if (currentImageIndex < 0)
				currentImageIndex = images.length - 1;
			if (currentImageIndex === 0)
			{
				superheroPlayerText.innerHTML = "Invisible";
				heroPowerPlayer1 = "Invisible";
			}
			else if (currentImageIndex === 1)
			{
				superheroPlayerText.innerHTML = "Duplication";
				heroPowerPlayer1 = "Duplication";
			}
			else if (currentImageIndex === 2)
			{
				superheroPlayerText.innerHTML = "Super strength";
				heroPowerPlayer1 = "Super strength";
			}
			else if (currentImageIndex === 3)
			{
				superheroPlayerText.innerHTML = "Time laps";
				heroPowerPlayer1 = "Time laps";
			}
			albumImage.src = images[currentImageIndex];
			heroPowerPlayer1 = superheroPlayerText.innerHTML;
			albumImage.style.width = "60%";
			albumImage.style.height = "60%";
		});
	}
	else
		console.log("prevBtn not found");

	const nextBtn = document.getElementById("right-arrow1");
	if (nextBtn)
	{
		nextBtn.addEventListener('click', () => {
			const albumImage = document.getElementById("superhero-image");
			const superheroPlayerText = document.getElementById("superhero-power-text-player1");
			currentImageIndex++;
			if (currentImageIndex >= images.length)
				currentImageIndex = 0;
			if (currentImageIndex === 0)
			{
				superheroPlayerText.innerHTML = "Invisible";
				heroPowerPlayer1 = "Invisible";
			}
			else if (currentImageIndex === 1)
			{
				superheroPlayerText.innerHTML = "Duplication";
				heroPowerPlayer1 = "Duplication";
			}
			else if (currentImageIndex === 2)
			{
				superheroPlayerText.innerHTML = "Super strength";
				heroPowerPlayer1 = "Super strength";
			}
			else if (currentImageIndex === 3)
			{
				superheroPlayerText.innerHTML = "Time laps";
				heroPowerPlayer1 = "Time laps";
			}
			albumImage.src = images[currentImageIndex];
			heroPowerPlayer1 = superheroPlayerText.innerHTML;
			albumImage.style.width = "60%";
			albumImage.style.height = "60%";
		});
	}
	else
		console.log("nextBtn not found");
}

function generatePreparationTournamentGamePageHTML()
{
	let buttonStr = "Start";
	let titleStr = "Preparation tournament";
	let numberPlayersStr = "Choose the number of players";
	let choseHeroStr = "Chose your hero";
	let numberPlayer = 64;
	let environnementStr = "Choose the surface :";
	let messageChangeOrientation = "Please rotate your device<br>to portrait mode";
	let textUnderColorButton1 = "Red";
	let textUnderColorButton2 = "Green";
	let textUnderColorButton3 = "Blue";
	let textUnderColorButton4 = "Custom";
	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;">${messageChangeOrientation}</h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="preparation-game-container" id="preparation-game-container">
			<h2>${titleStr}</h2>
			<div class="player-preparation-container">
				<div class="player-preparation-container-content">
					<div class="player-left-preparation">
						<h3 id="usernameGamePlayer1-text">${choseHeroStr}</h3>
						<div class="chose-superhero-container" id="chose-superhero-container1">
							<button class="left-arrow" id="left-arrow1">
								<i class="fa-solid fa-arrow-left"></i>
							</button>
							<img id="superhero-image" class="superhero-image" src="../images/super1.png" alt="Photo Album" style="width: 50%; height: 50%; border-radius: 10px;">
							<button class="right-arrow" id="right-arrow1">
								<i class="fa-solid fa-arrow-right"></i>
							</button>
						</div>
						<div class="superhero-power-text">
							<i class="fa-brands fa-superpowers" style="font-size: 15px; text-align: center;"></i>
							<p id="superhero-power-text-player1">Invisible</p>
						</div>
						<div class="color-button-container color-button-container-player1">
							<div class="color-button-text">
								<button id="color-button-red-player1" class="color-button color-button-player1" style="background-color: #E23F22; border: 3px solid #ffffff;"></button>
								<p class="text-under-color-button">${textUnderColorButton1}</p>
							</div>
							<div class="color-button-text">
								<button id="color-button-green-player1" class="color-button color-button-player1" style="background-color: #3BB323;"></button>
								<p class="text-under-color-button">${textUnderColorButton2}</p>
							</div>
							<div class="color-button-text">
								<button id="color-button-blue-player1" class="color-button color-button-player1" style="background-color: #32689A;"></button>
								<p class="text-under-color-button">${textUnderColorButton3}</p>
							</div>
							<div class="color-button-text">
								<div class="color-picker-container1" id="color-picker-container1">
									<input type="color" class="color-picker" id="color-picker-player1" value="#EEDC1B">
								</div>
								<p class="text-under-color-button">${textUnderColorButton4}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="number-players-tournament">
				<h3>${numberPlayersStr}</h3>
				<div class="number-players-tournament-buttons">
					<button id="players-button-64" class="players-button players-button-64" style="background-color: #6a4c93; border: 3px solid #ffffff;">
						<p class="string-plyers-button">${numberPlayer}</p>
					</button>
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
				<h3>${environnementStr}</h3>
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
			<input id="send-preparation-game-button" value="${buttonStr}" class="btn btn-success btn-block mb-4 send-preparation-game-button" style="width: 30%;">
		</div>
	`;
}

export function generatePreparationSoloTournamentPageHTML()
{
	let nav = generateNavigator("");
	let body = generatePreparationTournamentGamePageHTML();

	return (nav + body);
}