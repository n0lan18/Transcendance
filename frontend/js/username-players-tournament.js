import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { loadContent } from "./utils.js";
import { translation } from "./translate.js";

export function loadUsernamePlayersTournament(username1, courtColor, sizeTournament, sizePlayers, superPower)
{
    const usernamePlayersTournamentHTML = generateUsernamePlayersTournament(username1);

    addNavigatorEventListeners();

    loadContent(usernamePlayersTournamentHTML, "preparation-username-tournament", true);

	document.getElementById("app").innerHTML = usernamePlayersTournamentHTML;
    translation();
	addNavigatorEventListeners();

    const userTemplate = (index, username) => `
        <div class="superhero-container-for-username-tournament" id="superhero-container-for-username-tournament${index}">
            <div class="chose-superhero-container-for-username-tournament">
                <button class="left-arrow" id="left-arrow${index}">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <img id="superhero-image${index}" class="superhero-image" src="../images/super1.png" alt="Superhero Image" style="width: 50%; height: 50%; border-radius: 10px;">
                <button class="right-arrow" id="right-arrow${index}">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <div class="superhero-power-text">
                <i class="fa-brands fa-superpowers" style="font-size: 15px; text-align: center;"></i>
                <p id="superhero-power-text-player${index}">Invisible</p>
            </div>
        </div>
        <div id="RegisterPlace${index}" data-mdb-input-init class="form-outline mb-4">
			<div class="form-item">
				<label class="form-label" for="usernameRegister${index}">${username}${index}</label>
				<input type="text" id="usernameRegister${index}" name="usernameRegister" autocomplete="username" placeholder="${username}${index}" required class="form-control" />
			</div>
		</div>
        <div class="color-button-container color-button-container-player${index}">
            <div class="color-button-text">
                <button id="color-button-red-player${index}" class="color-button" style="background-color: #E23F22; border: 3px solid #ffffff;"></button>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton1"></p>
            </div>
            <div class="color-button-text">
                <button id="color-button-green-player${index}" class="color-button" style="background-color: #3BB323;"></button>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton2"></p>
            </div>
            <div class="color-button-text">
                <button id="color-button-blue-player${index}" class="color-button" style="background-color: #32689A;"></button>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton3"></p>
            </div>
            <div class="color-button-text">
                <div class="color-picker-container1">
                    <input type="color" class="color-picker" id="color-picker-player${index}" value="#EEDC1B">
                </div>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton4"></p>
            </div>
        </div>
        <input type="submit" value="Submit" class="btn btn-success btn-block mb-4 btn-username-players-tournament" id="buttonSend${index}">
    `;

    const addLinesPlayers = document.getElementById("username-players-line");
    if (addLinesPlayers)
    {
        for (let i = 0; i < sizeTournament; i++)
        {
            let userline = document.createElement("div");
            userline.id = `line${i + 1}`;
            userline.classList.add("username-line");
            if (i + 1 == 1)
                userline.innerHTML = userTemplate(1, username1);
            else
                userline.innerHTML = userTemplate(i + 1, "Player");
            addLinesPlayers.appendChild(userline);
            if (superPower === "isNotSuperPower")
            {
                const superheroContainer = document.getElementById(`superhero-container-for-username-tournament${i + 1}`);
                if (superheroContainer)
                    superheroContainer.remove();
            }
        }
    }
}

function generateUsernamePlayersTournamentHTML(username1)
{
    return `
    	<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
        <div class="preparation-username-players-container">
            <h1 data-translate-key="tournament"></h1>
            <div class="username-players-line" id="username-players-line"></div>
        </div>
    `;
}

function generateUsernamePlayersTournament(username1)
{
    let nav = generateNavigator();
	let body = generateUsernamePlayersTournamentHTML(username1);

	return (nav + body);
}