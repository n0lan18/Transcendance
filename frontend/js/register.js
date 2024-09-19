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

    let champsPassword = document.getElementById("passwordRegister");
    if (champsPassword) {
        champsPassword.addEventListener("input", (event) => {
            let passwordValue = champsPassword.value;
            console.log(passwordValue);
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
	let rememeberMeStr = "Remember me";
	let forgotPassword = "Forgot password?";
	let password1 = "1 letter";
	let password2 = "1 numeric or special character (e.g., #?!&)";
	let password3 = "10 characters";

	return `
		<div id="register" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
			<form id="registerForm">
				<div class="text-center">
					<h1 style="color: white;">${principalStr}</h1>
				</div>
				<div id="RegisterPlace" data-mdb-input-init class="form-outline mb-4">
					<label for="usernameRegister" class="form-label" style="color: white;">${usernameStr}</label>
					<input type="text" id="usernameRegister" name="usernameRegister" autocomplete="username" placeholder="${usernameStr}" required class="form-control" />
					<label class="form-label" for="emailRegister" style="color: white;">${emailStr}</label>
					<input type="email" id="emailRegister" name="emailRegister" autocomplete="email" placeholder="${emailStr}" required class="form-control" />
					<label class="form-label" for="passwordRegister" style="color: white;">${passwordStr}</label>
					<input type="password" id="passwordRegister" name="passwordRegister" autocomplete="new-password" placeholder="${passwordStr}" required class="form-control" />
					<ul style="color: white;">
						<li>${password1}</li>
						<li>${password2}</li>
						<li>${password3}</li>
					</ul>
				</div>
				<div class="row mb-4">
					<div class="col d-flex justify-content-center">
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
							<label class="form-check-label" for="form2Example31" style="color: white;">${rememeberMeStr}</label>
						</div>
					</div>
					<div class="col"
						<a href="#!" style="color: white; text-decoration: underline">${forgotPassword}</a>
					</div>
				</div>
				<input type="submit" value="${buttonStr}" class="btn btn-primary btn-block mb-4">
				<div class="text-center">
					<p style="color: white;">${accountStr} <a id="switchPageRegisterToLogin" href="#authentification" style="color: white; text-decoration: underline;">${loginStr}</a></p>
				</div>
			</form>
		</div>
	`;
}
