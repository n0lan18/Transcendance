import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { generateNavigator } from "./nav.js";
import { translation } from "./translate.js";
import { getUserInfo } from "./utils.js";
import { loadContent,  } from "./utils.js";
import { rgbToHex } from "./utils.js";
import { InitializeGameSocket } from "./websocket.js";
import { loadGameSearchPage } from "./gamesearch.js";

export async function loadOnlineGamePage()
{
	let userInfo = await getUserInfo();
	let username = userInfo.username;
	const preparationGameHTML = generatePreparationOnlinePageHTML(username);
	
	addNavigatorEventListeners();

	loadContent(document.getElementById("app"), preparationGameHTML, "preparation-online-game", true, 'Preparation Online Game', translation, addNavigatorEventListeners, addEventListenerPreparationOnlineGame);
	document.getElementById("app").innerHTML = preparationGameHTML;
	translation();
	addNavigatorEventListeners();

	addEventListenerPreparationOnlineGame()
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/preparation-online-game")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, "Preparation Online Game", translation, addNavigatorEventListeners,  addEventListenerPreparationOnlineGame);
	}
});

export async function addEventListenerPreparationOnlineGame()
{	
	let userInfo = await getUserInfo();
	let courtColor = "#CF5A30";
	let colorPlayer1 = "#E23F22";
	let heroPowerPlayer1 = "Invisible";
	let superPower = "isNotSuperPower";

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

	let sendPreparationGameButton = document.getElementById("send-preparation-game-button");
	if (sendPreparationGameButton)
	{
		sendPreparationGameButton.addEventListener('click', async function (event) {
			let userId = userInfo.id;
			let username = userInfo.username;
			let roomname = `room_${userInfo.username}_session`;
			sessionStorage.setItem("room_name", roomname);
			const socket = InitializeGameSocket(roomname);
			const url = `wss://localhost:8443/ws/onlinegame/${roomname}/`;

			socket.onopen = () => {
				socket.send(JSON.stringify({
					type: "start_search",
					player_id: userId,
					username: username,
					character: heroPowerPlayer1,
					court: courtColor,
					color: colorPlayer1,
					superpower: superPower,
					room_name: roomname
				}));

				console.log("WebSocket ouvert, envoi de données...");
				console.log(`Connecting to WebSocket URL: ${url}`);
				console.log("Connexion WebSocket initialisée pour la salle :", roomname);
				console.log(userInfo);
				console.log("User ID :", userId);
				console.log("Username :", username);
				console.log("Character :", heroPowerPlayer1);

				loadGameSearchPage()
			}

			socket.onerror = (error) => {
				console.error("WebSocket Error:", error);
			};
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

	let currentImageIndex = 0;

	const prevBtn = document.getElementById("left-arrow1");
	if (prevBtn)
	{
		prevBtn.addEventListener('click', (event) => {
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
			albumImage.style.width = "40%";
			albumImage.style.height = "40%";
		});
	}

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
			albumImage.style.width = "40%";
			albumImage.style.height = "40%";
		});
	}

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

	let superHeroContainer = document.getElementById("superhero-container1");
	if (superPower === "isNotSuperPower") {
		superHeroContainer.style.display = "none";
}
}

function generatePreparationOnlineGamePageHTML(username)
{
	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="preparation-game-container" id="preparation-game-container">
			<h1 data-translate-key="online"></h1>
			<div class="radio-superPower">
    			<div class="radio-isSuperPower">
        			<input type="radio" id="isSuperPower" name="choice" value="isSuperPower">
        			<label for="isSuperPower" data-translate-key="isSuperPower">Avec Super-pouvoirs</label>
    			</div>
    			<div class="radio-isNotSuperPower">
        			<input type="radio" id="isNotSuperPower" name="choice" value="isNotSuperPower" checked>
        			<label for="isNotSuperPower" data-translate-key="isNotSuperPower">Sans Super-pouvoirs</label>
    			</div>
			</div>
			<div class="player-left-preparation">
						<h2 id="usernameGamePlayer1-text">${username}</h2>
						<div class="superhero-container" id="superhero-container1">
							<div class="chose-superhero-container" id="chose-superhero-container1">
								<button class="left-arrow" id="left-arrow1">
									<i class="fa-solid fa-arrow-left"></i>
								</button>
								<img id="superhero-image" class="superhero-image" src="../images/super1.png" alt="Photo Album" style="width: 40%; height: 40%; border-radius: 10px;">
								<button class="right-arrow" id="right-arrow1">
									<i class="fa-solid fa-arrow-right"></i>
								</button>
							</div>
							<div class="superhero-power-text" id="superhero-power-text">
								<i class="fa-brands fa-superpowers" style="font-size: 15px; text-align: center;"></i>
								<p id="superhero-power-text-player1">Invisible</p>
							</div>
						</div>
						<div class="color-button-container color-button-container-player1">
							<div class="color-button-text">
								<button id="color-button-red-player1" class="color-button color-button-player1" style="background-color: #E23F22; border: 3px solid #ffffff;"></button>
								<p class="text-under-color-button" data-translate-key="textUnderColorButton1"></p>
							</div>
							<div class="color-button-text">
								<button id="color-button-green-player1" class="color-button color-button-player1" style="background-color: #3BB323;"></button>
								<p class="text-under-color-button" data-translate-key="textUnderColorButton2"></p>
							</div>
							<div class="color-button-text">
								<button id="color-button-blue-player1" class="color-button color-button-player1" style="background-color: #32689A;"></button>
								<p class="text-under-color-button" data-translate-key="textUnderColorButton3"></p>
							</div>
							<div class="color-button-text">
								<div class="color-picker-container1" id="color-picker-container1">
									<input type="color" class="color-picker" id="color-picker-player1" value="#EEDC1B">
								</div>
								<p class="text-under-color-button" data-translate-key="textUnderColorButton4"></p>
							</div>
						</div>
					</div>
			<input id="send-preparation-game-button" data-translate-key="start" value="" class="btn btn-success btn-block mb-4 send-preparation-game-button" style="width: 30%;">
		</div>
	`;
}

export function generatePreparationOnlinePageHTML(username)
{
	let nav = generateNavigator();
	let body = generatePreparationOnlineGamePageHTML(username);

	return (nav + body);
}