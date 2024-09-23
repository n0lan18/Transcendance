import { loadAuthentificationPage } from "./auth.js";
import { loadContent } from "./utils.js";

export function loadRegisterPage() {

    let registerHTML = generateRegisterHTML();

    loadContent(registerHTML, "register", true);

    document.getElementById("app").innerHTML = generateRegisterHTML();
    let champsUsername = document.getElementById("usernameRegister");
    if (champsUsername) {
        champsUsername.addEventListener("input", (event) => {
            let usernameValue = champsUsername.value;
            console.log(usernameValue);
        });
    }

	let champsEmail = document.getElementById("emailRegister");
	if (champsEmail) {
		champsEmail.addEventListener("input", (event) => {
			let userValue = champsEmail.value;
			console.log(userValue);
		});
	}

    let switchPageRegisterToLogin = document.getElementById("switchPageRegisterToLogin");
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
			const username = document.getElementById("usernameRegister");
			const email = document.getElementById("emailRegister");
			const password = document.getElementById("passwordRegister");
			const data = {
				username: username.value,
                email: email.value,
				password: password.value,
			}
            if (!username.value || !email.value || !password.value )
            {
                console.error('All fields are required.');
                return;
            }
            console.log("SENDING DATA: ", data);
			sendDataToDatabase(data);
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

	function checkPasswordForm(regex, value, partForm)
	{
		if (!partForm)
			return ;
		const item = partForm.querySelector('i');
		if (regex.test(value))
		{
			item.classList.remove('fa-circle');
			item.classList.add('fa-circle-check', 'valid-password');
			partForm.classList.add('valid-password');
		}
		else
		{
			item.classList.remove('fa-circle-check', 'valid-password');
			item.classList.add('fa-circle');
			partForm.classList.remove('valid-password');
		}
	}

    window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page) {
			// Charger le contenu associé à la page
			loadContent(event.state.page, '', false); // Pas besoin d'ajouter à l'historique à nouveau
		}
	});
}

async function sendDataToDatabase(data)
{
	try {
		const response = await fetch('https://localhost:8443/api/register/', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();
		console.log('Success:', result);
		loadAuthentificationPage();
	} catch (error) {
		console.error('Error:', error);
	}
}

function generateRegisterHTML() {
	let usernameStr = "Username";
	let principalStr = "Register to play";
	let emailStr = "E-mail address";
	let passwordStr = "Password";
	let buttonStr = "Send";
	let accountStr = "Don't you have an account?";
	let loginStr = "Login to Pong";
	let password1 = "1 letter";
	let password2 = "1 numeric or special character (e.g., #?!&)";
	let password3 = "10 characters";

	return `
		<div id="register" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
			<form id="registerForm">
				<div class="text-center">
					<h1>${principalStr}</h1>
				</div>
				<div id="RegisterPlace" data-mdb-input-init class="form-outline mb-4">
					<div class="form-item">
						<label for="usernameRegister" class="form-label">${usernameStr}</label>
						<input type="text" id="usernameRegister" name="usernameRegister" autocomplete="username" placeholder="${usernameStr}" required class="form-control" />
					</div>
					<div class="form-item">
						<label class="form-label" for="emailRegister"">${emailStr}</label>
						<input type="email" id="emailRegister" name="emailRegister" autocomplete="email" placeholder="${emailStr}" required class="form-control" />
					</div>

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
				<input type="submit" value="${buttonStr}" class="btn btn-success btn-block mb-4">
				<div class="text-center">
					<p style="color: #b3b3b3";>${accountStr} <a id="switchPageRegisterToLogin" href="#authentification"; text-decoration: underline; style="color: white;">${loginStr}</a></p>
				</div>
			</form>
		</div>
	`;
}
