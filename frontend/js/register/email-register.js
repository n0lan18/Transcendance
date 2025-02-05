import { getCookie, loadContent, saveData } from "../utils.js";
import { loadAuthentificationPage } from "../auth.js";
import { loadRegisterUsernamePage } from "./username-register.js";

export function loadRegisterEmailPage() {

	let emailRegisterHTML = generateEmailPartHTML();

	loadContent(document.getElementById("app"), emailRegisterHTML, "register-email", true, "Register Email", "", "", addEventListenerEmailRegister);
	
	document.getElementById("app").innerHTML = generateEmailPartHTML();

	addEventListenerEmailRegister();
}

export function addEventListenerEmailRegister()
{
	let switchPageEmailRegisterToLogin = document.getElementById("switchPageEmailRegisterToLogin");
    if (switchPageEmailRegisterToLogin) {
        switchPageEmailRegisterToLogin.addEventListener("click", (event) => {
            event.preventDefault();
        	loadAuthentificationPage();
    	});
	}

	let emailRegister = document.getElementById("registerEmailForm");
	if (emailRegister)
	{
		emailRegister.addEventListener("submit", (event) =>
		{
			event.preventDefault();
			const email = document.getElementById("emailRegister");
			const data = {
				email: email.value,
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
			if (emailRegex.test(email.value))
				sendDataToDatabase(data, email);
			else
			{
				let registerPlace = document.getElementById("RegisterPlace");
				if (!document.getElementById('badEmail'))
				{
					let item = document.createElement('p');
					item.id = "badEmail";
					item.textContent = 'Invalid email';
					item.classList.add("invalid-register");
					registerPlace.appendChild(item);
					let buttonSend = document.getElementById("buttonSend");
					buttonSend.classList.remove('btn-success');
					buttonSend.classList.add('btn-danger');
				}
			}
		});
	}
}

function sendDataToDatabase(data, email)
{
	const csrftoken = getCookie('csrftoken');
	fetch('api/check-email/', {
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
				if (!document.getElementById("emailExist"))
				{
					let emailExist = document.createElement("p");
					emailExist.id = "emailExist";
					emailExist.classList.add("invalid-register");
					emailExist.textContent = 'This email address already exists';
					item.appendChild(emailExist);
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
			saveData("email", email);
			loadRegisterUsernamePage();
		}
	})
	.catch(error => console.error('Error:', error));
}

function generateEmailPartHTML() {
	let principalStr = "Register to play";
	let emailStr = "E-mail address";
	let buttonStr = "Send";
	let accountStr = "Do you have already an account?";
	let loginStr = "Login to Pong";

	return `
		<div id="register" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
			<form id="registerEmailForm">
				<div class="text-center">
					<h1>${principalStr}</h1>
				</div>
				<div id="RegisterPlace" data-mdb-input-init class="form-outline mb-4">
					<div class="form-item">
						<label class="form-label" for="emailRegister"">${emailStr}</label>
						<input type="text" id="emailRegister" name="emailRegister" autocomplete="email" placeholder="${emailStr}" required class="form-control" />
					</div>
				</div>
				<input type="submit" value="${buttonStr}" class="btn btn-success btn-block mb-4" id="buttonSend">
				<div class="text-center">
					<p style="color: #b3b3b3";>${accountStr} <a id="switchPageEmailRegisterToLogin" href="#authentification"; text-decoration: underline; style="color: white;">${loginStr}</a></p>
				</div>
			</form>
		</div>
	`;
}