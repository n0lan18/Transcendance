import { loadContent, getCookie, loadDataStorage } from "../utils.js";
import { loadAuthentificationPage } from "../auth.js";

let usernameForm;
let emailForm;

export function loadRegisterPasswordPage() {

	const username = loadDataStorage("username");
	const email = loadDataStorage("email");

	let passwordRegisterHTML = generatePasswordPartHTML();

	loadContent(document.getElementById("app"), passwordRegisterHTML, "register-password", true, "Register Password", "", "", addEventListenerPasswordRegister);
	
	document.getElementById("app").innerHTML = generatePasswordPartHTML();

	addEventListenerPasswordRegister(username, email);
}

export function addEventListenerPasswordRegister(username, email)
{
	let switchPageRegisterToLogin = document.getElementById("switchPagePasswordRegisterToLogin");
	if (switchPageRegisterToLogin) {
		switchPageRegisterToLogin.addEventListener("click", (event) => {
			event.preventDefault();
			loadAuthentificationPage();
		});
	}

	let formRegister = document.getElementById("registerForm");
	if (formRegister)
	{
		formRegister.addEventListener("submit", (event) =>
		{
			event.preventDefault();
			const password = document.getElementById("passwordRegister");
			const data = {
				username: username,
                email: email,
				password: password.value,
			}
			const letterRegex = new RegExp("[a-zA-Z]");
			const numberOrSpecialCharRegex = new RegExp("[0-9.#?!&]");
			const minCharacterRegex = new RegExp("^.{10,}$");
			if (letterRegex.test(password.value) && numberOrSpecialCharRegex.test(password.value) && minCharacterRegex.test(password.value))
				sendDataToDatabase(data);
			else
			{
				if (!letterRegex.test(password.value))
					errorPasswordForm(document.getElementById("check-letter-password"));
				else if (!numberOrSpecialCharRegex.test(password.value))
					errorPasswordForm(document.getElementById("check-num-or-special-character-password"));
				else if (!minCharacterRegex.test(password.value))
					errorPasswordForm(document.getElementById("check-number-characters-password"))
				let buttonSend = document.getElementById("buttonSend");
				buttonSend.classList.remove("btn-success");
				buttonSend.classList.add("btn-danger");
			}
		});
	}

	const switchHidePasswordToSee = document.getElementById("input-password");
	if (switchHidePasswordToSee)
	{
		const buttonChange = document.getElementById("togglePassword");
		const toggleIcon = buttonChange.querySelector('i');
		const passwordInput = document.getElementById("passwordRegister");
		buttonChange.addEventListener('click', function () {
			if (passwordInput.type === 'password') {
				passwordInput.type = 'text';
				toggleIcon.classList.remove('fa-eye-slash');
				toggleIcon.classList.add('fa-eye');
			} else {
				passwordInput.type = 'password';
				toggleIcon.classList.remove('fa-eye');
				toggleIcon.classList.add('fa-eye-slash');
			}
		})
	}

	const approvePassword = document.getElementById("password-form");
	if (approvePassword)
	{
		let champsPassword = document.getElementById("passwordRegister");
		if (champsPassword) {
			champsPassword.addEventListener("input", (event) => {
				let passwordValue = champsPassword.value;
				const letterRegex = new RegExp("[a-zA-Z]");
				const numberOrSpecialCharRegex = new RegExp("[0-9.#?!&]");
				const minCharacterRegex = new RegExp("^.{10,}$");
				checkPasswordForm(letterRegex, passwordValue, document.getElementById("check-letter-password"));
				checkPasswordForm(numberOrSpecialCharRegex, passwordValue, document.getElementById("check-num-or-special-character-password"));
				checkPasswordForm(minCharacterRegex, passwordValue, document.getElementById("check-number-characters-password"));
			});
		}
	}
}

export function checkPasswordForm(regex, value, partForm)
{
	if (!partForm)
		return ;
	const item = partForm.querySelector('i');
	if (regex.test(value))
	{
		item.classList.remove('fa-circle');
		item.classList.remove('fa-circle-xmark', 'invalid-register');
		item.classList.add('fa-circle-check', 'valid-password');
		partForm.classList.remove('invalid-register')
		partForm.classList.add('valid-password');
	}
	else
	{
		item.classList.remove('fa-circle-check', 'valid-password');
		item.classList.add('fa-circle-xmark', 'invalid-register');
		partForm.classList.remove('valid-password');
		partForm.classList.add('invalid-register');
	}
}

export function errorPasswordForm(partForm)
{
	if (!partForm)
		return;
	const item = partForm.querySelector('i');
	item.classList.remove('fa-circle');
	item.classList.add('fa-circle-xmark', 'invalid-register');
	partForm.classList.add('invalid-register');
}

async function sendDataToDatabase(data)
{
	try {
		const csrftoken = getCookie('csrftoken');
		const response = await fetch('api/register/', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
			body: JSON.stringify( data ),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();
		loadAuthentificationPage();
	} catch (error) {
		console.error('Error:', error);
	}
}

function generatePasswordPartHTML() {
	let principalStr = "Register to play";
	let passwordStr = "Password";
	let password1 = "1 letter";
	let password2 = "1 numeric or special character (e.g., #?!&)";
	let password3 = "10 characters";
	let buttonStr = "Send";
	let accountStr = "Do you have already an account?";
	let loginStr = "Login to Pong";

	return `
		<div id="register" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
			<form id="registerForm">
				<div class="text-center">
					<h1>${principalStr}</h1>
				</div>
				<div id="RegisterPlace" data-mdb-input-init class="form-outline mb-4">
					<label class="form-label" for="passwordRegister">${passwordStr}</label>
					<div id=password-form>
						<div id="input-password" style="position: relative;">
							<input type="password" id="passwordRegister" name="passwordRegister" autocomplete="new-password" placeholder="${passwordStr}" required class="form-control"  style="padding-right: 40px;" />
							<button type="button" class="toggle-password" id="togglePassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #b3b3b3; padding: 0;">
								<i class="fa-solid fa-eye-slash"></i>
							</button>
						</div>
						<ul style="padding-top: 5px; list-style: none; padding-left: 0;">
							<div id="check-letter-password">
								<li><i class="fa-solid fa-circle" style="font-size: 10px;"></i> ${password1}</li>
							</div>
							<div id="check-num-or-special-character-password">
								<li><i class="fa-solid fa-circle" style="font-size: 10px;"></i> ${password2}</li>
							</div>
							<div id="check-number-characters-password">
								<li><i class="fa-solid fa-circle" style="font-size: 10px;"></i> ${password3}</li>
							</div>
						</ul>
					</div>
				</div>
				<input type="submit" value="${buttonStr}" class="btn btn-success btn-block mb-4" id="buttonSend">
				<div class="text-center">
					<p style="color: #b3b3b3";>${accountStr} <a id="switchPagePasswordRegisterToLogin" href="#authentification"; text-decoration: underline; style="color: white;">${loginStr}</a></p>
				</div>
			</form>
		</div>
	`;
}