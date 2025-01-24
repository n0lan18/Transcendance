import { loadContent, getCookie, isValidUsername, saveData } from "../utils.js";
import { loadAuthentificationPage } from "../auth.js";
import { loadRegisterPasswordPage } from "./password-register.js";

export function loadRegisterUsernamePage() {

	let usernameRegisterHTML = generateUsernamePartHTML();

	loadContent(document.getElementById("app"), usernameRegisterHTML, "register-username", true, "Register Username", "", "", addEventListenerUsernameRegister);
	
	document.getElementById("app").innerHTML = generateUsernamePartHTML();

	addEventListenerUsernameRegister();
}

export function addEventListenerUsernameRegister(email)
{
	let switchPageUsernameRegisterToLogin = document.getElementById("switchPageUsernameRegisterToLogin");
    if (switchPageUsernameRegisterToLogin) {
        switchPageUsernameRegisterToLogin.addEventListener("click", (event) => {
            event.preventDefault();
        	loadAuthentificationPage();
    	});
	}

	let usernameRegister = document.getElementById("registerUsernameForm");
	if (usernameRegister)
	{
		usernameRegister.addEventListener("submit", (event) =>
		{
			event.preventDefault();
			const username = document.getElementById("usernameRegister");
			if (isValidUsername(username.value))
			{
				const data = {
					username: username.value,
				}
				const csrftoken = getCookie('csrftoken');
				fetch('api/check-username/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': csrftoken,
					},
					body: JSON.stringify({ data })
				})
				.then(async (response) => {
					if (!response.ok) {
                    	// Si pas OK, gérer la réponse d'erreur
                    	return response.json().then((data) => {
							let item = document.getElementById("RegisterPlace");
							if (!document.getElementById("usernameExist"))
							{
								let usernameExist = document.createElement("p");
								usernameExist.id = "usernameExist";
								usernameExist.classList.add("invalid-register");
								usernameExist.textContent = 'This username already exists';
								item.appendChild(usernameExist);
								let buttonSend = document.getElementById("buttonSend");
								buttonSend.classList.remove('btn-success');
								buttonSend.classList.add('btn-danger');
							}
                        	throw new Error(data.message || "Something went wrong");
						});
					}
					return response.json();
				})
				.then((data) => {
					if (!data.exists)
					{
						saveData("username", username);
						loadRegisterPasswordPage();
					}
				})
				.catch(error => console.error('Error:', error));
			}
			else
			{
				let item = document.getElementById("RegisterPlace");
				if (!document.getElementById("badUsername"))
				{
					let badUsername = document.createElement("p");
					badUsername.id = "badUsername";
					badUsername.classList.add("invalid-register");
					badUsername.textContent = 'Bad username';
					item.appendChild(badUsername);
					let buttonSend = document.getElementById("buttonSend");
					buttonSend.classList.remove('btn-success');
					buttonSend.classList.add('btn-danger');
				}			
			}
		});
	}
}

function generateUsernamePartHTML() {
	let principalStr = "Register to play";
	let usernameStr = "Username";
	let buttonStr = "Send";
	let accountStr = "Do you have already an account?";
	let loginStr = "Login to Pong";

	return `
		<div id="register" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
			<form id="registerUsernameForm">
				<div class="text-center">
					<h1>${principalStr}</h1>
				</div>
				<div id="RegisterPlace" data-mdb-input-init class="form-outline mb-4">
					<div class="form-item">
						<label class="form-label" for="usernameRegister">${usernameStr}</label>
						<input type="text" id="usernameRegister" name="usernameRegister" autocomplete="username" placeholder="${usernameStr}" required class="form-control" />
					</div>
				</div>
				<input type="submit" value="${buttonStr}" class="btn btn-success btn-block mb-4" id="buttonSend">
				<div class="text-center">
					<p style="color: #b3b3b3";>${accountStr} <a id="switchPageUsernameRegisterToLogin" href="#authentification"; text-decoration: underline; style="color: white;">${loginStr}</a></p>
				</div>
			</form>
		</div>
	`;
}