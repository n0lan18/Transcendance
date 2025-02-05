import { generateNavigator } from "./nav.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { escapeHTML, getTournamentBasicInfo, getUserInfo, isValidUsername, loadContent, putTournamentInfo } from "./utils.js";
import { translation } from "./translate.js";
import { rgbToHex } from "./utils.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";

export function loadUsernamePlayersTournament()
{  
    const usernamePlayersTournamentHTML = generateUsernamePlayersTournament();

    addNavigatorEventListeners();

    loadContent(document.getElementById("app"), usernamePlayersTournamentHTML, "preparation-username-tournament", true, 'Preparation Username Tournament', translation, addNavigatorEventListeners, addEventListenerUsernamePlayersTournament);

	document.getElementById("app").innerHTML = usernamePlayersTournamentHTML;
    translation();
	addNavigatorEventListeners();
}

window.addEventListener('popstate', async function(event) {
    if (event.state && event.state.page) {
        if (this.window.location.pathname === "/preparation-username-tournament")
            loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Preparation Username Tournament', translation, addNavigatorEventListeners, addEventListenerUsernamePlayersTournament);
    }
});

async function addEventListenerUsernamePlayersTournament()
{
    let userInfo = await getUserInfo();
    let tournamentBasicInfo = await getTournamentBasicInfo()
	let username1 = userInfo.username;
    let courtColor = tournamentBasicInfo.courtColor;
    let sizeTournament = tournamentBasicInfo.sizeTournament;
    let superPower = tournamentBasicInfo.superPower;

    const images = [
        "../images/super1.png",
        "../images/super2.png",
        "../images/super3.png",
        "../images/super4.png",
    ];

    let tab = [];
    for (let i = 0; i < sizeTournament; i++)
    {
        let playerdef = [];
        if (i == 0)
            playerdef.push(username1);
        else
            playerdef.push(`Player${i + 1}`);
        if (superPower === "isSuperPower")
            playerdef.push("Invisible");
        else
            playerdef.push("none");
        playerdef.push("#E23F22")
        tab.push(playerdef);
    }

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
            <div class=color-button-text color-button-text${index}">
                <button id="color-button-red-player${index}" class="color-button" style="background-color: #E23F22; border: 3px solid #ffffff;"></button>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton1"></p>
            </div>
            <div class="color-button-text color-button-text${index}">
                <button id="color-button-green-player${index}" class="color-button" style="background-color: #3BB323;"></button>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton2"></p>
            </div>
            <div class="color-button-text color-button-text${index}">
                <button id="color-button-blue-player${index}" class="color-button" style="background-color: #32689A;"></button>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton3"></p>
            </div>
            <div class="color-button-text color-button-text${index}">
                <div class="color-picker-container1" id="color-picker-container${index}">
                    <input type="color" class="color-picker" id="color-picker-player${index}" value="#EEDC1B">
                </div>
                <p class="text-under-color-button" data-translate-key="textUnderColorButton4"></p>
            </div>
        </div>
    `;

    const buttonSendEvent = async function(event) {
        event.preventDefault();
        await putTournamentInfo(tab, courtColor, sizeTournament, superPower);
    }

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
            let currentImageIndex = 0;
            let usernameInput;

            let prevBtn = document.getElementById(`left-arrow${i + 1}`);
            if (prevBtn)
            {
                prevBtn.addEventListener('click', (event) => {
                    const albumImage = document.getElementById(`superhero-image${i + 1}`);
                    const superheroPlayerText = document.getElementById(`superhero-power-text-player${i + 1}`);
                    currentImageIndex--;
                    if (currentImageIndex < 0)
                        currentImageIndex = images.length - 1;
                    if (currentImageIndex === 0)
                        superheroPlayerText.innerHTML = "Invisible";
                    else if (currentImageIndex === 1)
                        superheroPlayerText.innerHTML = "Duplication";
                    else if (currentImageIndex === 2)
                        superheroPlayerText.innerHTML = "Super strength";
                    else if (currentImageIndex === 3)
                        superheroPlayerText.innerHTML = "Time laps";
                    albumImage.src = images[currentImageIndex];
                    tab[i][1] = superheroPlayerText.innerHTML;
                    albumImage.style.width = "50%";
                    albumImage.style.height = "50%";
                });
            }
        
            let nextBtn = document.getElementById(`right-arrow${i + 1}`);
            if (nextBtn)
            {
                nextBtn.addEventListener('click', () => {
                    const albumImage = document.getElementById(`superhero-image${i + 1}`);
                    const superheroPlayerText = document.getElementById(`superhero-power-text-player${i + 1}`);
                    currentImageIndex++;
                    if (currentImageIndex >= images.length)
                        currentImageIndex = 0;
                    if (currentImageIndex === 0)
                        superheroPlayerText.innerHTML = "Invisible";
                    else if (currentImageIndex === 1)
                        superheroPlayerText.innerHTML = "Duplication";
                    else if (currentImageIndex === 2)
                        superheroPlayerText.innerHTML = "Super strength";
                    else if (currentImageIndex === 3)
                        superheroPlayerText.innerHTML = "Time laps";
                    albumImage.src = images[currentImageIndex];
                    tab[i][1] = superheroPlayerText.innerHTML;
                    albumImage.style.width = "50%";
                    albumImage.style.height = "50%";
                });
            }

            usernameInput = document.getElementById(`usernameRegister${i + 1}`);

            let inputUsername;
            if (usernameInput)
            {
                usernameInput.addEventListener(('input'), function(event) {
                    inputUsername = event.target.value;
                    const parent = document.getElementById(`RegisterPlace${i + 1}`);
                    if (!isValidUsername(inputUsername) && inputUsername.length > 0)
                    {
                        if (!document.getElementById(`message-valid-username${i + 1}`))
                        {
                            let messageValidUsername = document.createElement("p");
                            messageValidUsername.id = `message-valid-username${i + 1}`;
                            messageValidUsername.classList.add("invalid-register");
                            messageValidUsername.textContent = "Invalid Username exist";
                            parent.appendChild(messageValidUsername);
                        }                        
                    }
                    else
                    {
                        if (document.getElementById(`message-valid-username${i + 1}`))
                            document.getElementById(`message-valid-username${i + 1}`).remove()
                    }
                    let exist = 0;
                    for (let i = 0; i < sizeTournament; i++)
                    {
                        if (tab[i].includes(inputUsername))
                            exist = 1;
                    }
                    if (exist == 1)
                    {
                        if (parent)
                        {
                            if (!document.getElementById(`message-bad-username${i + 1}`))
                            {
                                let message = document.createElement("p");
                                message.id = `message-bad-username${i + 1}`;
                                message.classList.add("invalid-register");
                                message.textContent = "Username already exist";
                                parent.appendChild(message);
                                document.getElementById("send-preparation-game-button").classList.remove("btn-success");
                                document.getElementById("send-preparation-game-button").classList.add("btn-danger");
                                document.getElementById("send-preparation-game-button").removeEventListener('click', buttonSendEvent);
                            }
                        }
                    }
                    else
                    {
                        if (document.getElementById(`message-bad-username${i + 1}`))
                            document.getElementById(`message-bad-username${i + 1}`).remove();
                        document.getElementById("send-preparation-game-button").classList.remove("btn-danger");
                        document.getElementById("send-preparation-game-button").classList.add("btn-success");
                        document.getElementById("send-preparation-game-button").addEventListener('click', buttonSendEvent);
                    }
                    if (inputUsername.length <= 14)
                        tab[i][0] = escapeHTML(inputUsername);
                    if (inputUsername.length == 0)
                    {
                        if (i == 0)
                            tab[i][0] = username1;
                        else
                            tab[i][0] = `Player${i + 1}`;
                    }
                });
            }

            document.querySelectorAll(`.color-button-container-player${i + 1} .color-button`).forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    document.querySelectorAll(`.color-button-container-player${i + 1} .color-button`).forEach(button => {
                        button.style.border = "none";
                    });
                    event.target.style.border = "3px solid #ffffff";
                    let color = event.target.style.backgroundColor;
                    tab[i][2] = rgbToHex(color);
                    const colorPickerContainer1 = document.getElementById(`color-picker-container${i + 1}`);
                    const colorPicker1 = document.getElementById(`color-picker-player${i + 1}`);
                    colorPickerContainer1.style.backgroundColor = colorPicker1.value;
                });
            });
            let colorPicker1 = document.getElementById(`color-picker-player${i + 1}`);
            if (colorPicker1)
            {
                colorPicker1.addEventListener('input', function (event) {
                    tab[i][2] = event.target.value;
                    const colorPickerContainer1 = document.getElementById(`color-picker-container${i + 1}`);
                    colorPickerContainer1.style.backgroundColor = "#ffffff";
                    document.querySelectorAll(`.color-button-container-player${i + 1} .color-button`).forEach(button => {
                        button.style.border = "none";
                    });
                });
            }
        }
    }

    const buttonStart = document.getElementById("send-preparation-game-button");
    if (buttonStart)
        buttonStart.addEventListener('click', buttonSendEvent);

    const buttonStartRandom = document.getElementById("send-preparation-game-button-random");
    if (buttonStartRandom)
    {
        buttonStartRandom.addEventListener( ('click'), async function (event) {
            event.preventDefault();
            const stringsHeroPowerPlayer = ["Invisible", "Duplication", "Super strength", "Time laps", "Invisible", "Duplication", "Super strength", "Time laps", "Invisible", "Duplication", "Super strength", "Time laps"];
            const stringsColorPlayer = ["#E23F22", "#3BB323", "#32689A", "#EEDC1B", "#1BD5EE", "#9A1BEE", "#FD5DBD", "#5FEC8A"];
            for (let i = 0; i < sizeTournament; i++)
            {
                if (superPower === "isSuperPower")
                    tab[i][1] = stringsHeroPowerPlayer[Math.floor(Math.random() * stringsHeroPowerPlayer.length)];
                tab[i][2] = stringsColorPlayer[Math.floor(Math.random() * stringsColorPlayer.length)];
            }
            await putTournamentInfo(tab, courtColor, sizeTournament, superPower);
        });
    }
}

function generateUsernamePlayersTournamentHTML()
{
    return `
    	<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
        <div class="preparation-username-players-container">
            <h1 data-translate-key="tournament"></h1>
            <div class="username-players-line" id="username-players-line"></div>
            <div class="button-launch-tournament">
                <input id="send-preparation-game-button" data-translate-key="start" value="" class="btn btn-success btn-block mb-4 send-preparation-game-button" style="width: 30%; margin-right: 5px;">
                <input id="send-preparation-game-button-random" data-translate-key="startRandom" value="" class="btn btn-primary mb-4 send-preparation-game-button" style="width: 30%; margin-left: 5px;">
            </div>        
        </div>
    `;
}

function generateUsernamePlayersTournament()
{
    let nav = generateNavigator();
	let body = generateUsernamePlayersTournamentHTML();

	return (nav + body);
}