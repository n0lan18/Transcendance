import { loadRegisterPage } from "./register.js";
import { loadHomePage } from "./home.js";
import { loadContent } from "./utils.js";

export function loadAuthentificationPage()
{
	let authHTML = generateAuthentificationHTML();

	loadContent(authHTML, "login", true);

    document.getElementById("app").innerHTML = generateAuthentificationHTML();
    let champsEmail = document.getElementById("usernameEmailLogin");
	if (champsEmail)
	{
    	champsEmail.addEventListener("input",
    	(event) =>
    	{
    	    let usernameValue = champsEmail.value;
    	    console.log(usernameValue);
    	});
	}

    let champsPassword = document.getElementById("passwordLogin");
	if (champsPassword)
	{
    	champsPassword.addEventListener("input",
    	(event) =>
    	{
    	    let passwordValue = champsPassword.value;
    	    console.log(passwordValue);
    	});
	}

    let switchPageLoginToRegister = document.getElementById("sub-link-page");
	if (switchPageLoginToRegister)
	{
		switchPageLoginToRegister.addEventListener("click",
	    (event) =>
	    {
	        event.preventDefault();
			loadRegisterPage();
	    });
	}
	checkConnexion();

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page) {
			// Charger le contenu associé à la page
			loadContent(event.state.page, '', false); // Pas besoin d'ajouter à l'historique à nouveau
		}
	});
}

async function checkConnexion()
{
	let authForm = document.getElementById("authForm");
	if (authForm)
	{
		authForm.addEventListener("submit", async (event) =>
		{
			event.preventDefault();
			const emailUsername = document.getElementById("usernameEmailLogin").value;
			const password = document.getElementById("passwordLogin").value;
			if (!emailUsername || !password) {
				console.log('Please fill in both fields');
				return ;
			}
			const credentials = {
				emailUsername: emailUsername,
				password: password,
			};
			console.log("SENDING DATA:", credentials);
			try
			{
				const response = await fetch('https://localhost:8443/api/login/', {
					method: 'POST',
					headers: {
						'Content-Type' : 'application/json',
					},
					body: JSON.stringify(credentials),
				});
				if (response.ok)
				{
					const data = await response.json();
					const token = data.access;

					localStorage.setItem('jwt_token', token);
					console.log('Login successful!');
					loadHomePage();
				}
				else
				{
					const errorData = await response.json();
					console.log(errorData.detail || 'login failed.');
					const button = document.getElementById('buttonLogin');
					
				}
			} catch (error) {
				console.error('Error:', error);
				console.log('An error occured.');
			}
		});
	}
}

export function generateAuthentificationHTML()
{
	let principalStr = "I've an account";
	let emailUsernameStr = "Username or e-mail adress";
	let passwordStr = "Password";
	let buttonStr = "Send";
	let accountStr = "Don't you have account ?";
	let registerStr = "Registrer to Pong";
	let rememeberMeStr = "Remember me";
	let forgotPassword = "Forgot password?";
	return `
		<div id="authentification" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
			<form id=authForm>
				<div class="text-center">
					<h1 style="color: white;">${principalStr}</h1>
				</div>
				<div id="loginPlace" data-mdb-input-init class="form-outline mb-4">
					<label for="usernameEmailLogin" class="form-label">${emailUsernameStr}</label>
					<input type="text" id="usernameEmailLogin" name="usernameEmailLogin" autocomplete="userEmailLogin" placeholder="${emailUsernameStr}" required class="form-control" />
					<label for="passwordLogin" class="form-label">${passwordStr}</label>
					<input type="password" id="passwordLogin" name="passwordLogin" autocomplete="new-password" placeholder="${passwordStr}" required class="form-control" />
				</div>
				<div class="row mb-4">
					<div class="col d-flex justify-content-center">
						<div class="form-check">
							<input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
							<label class="form-check-label" for="form2Example31">${rememeberMeStr}</label>
						</div>
					</div>
					<div class="col">
						<a href="#!" style="color: white; text-decoration: underline">${forgotPassword}</a>
					</div>
				</div>				
				<input id="buttonLogin" type="submit" value="${buttonStr}" class="btn btn-success btn-block mb-4">
				<div class="text-center">
					<p">${accountStr} <a href="#register" id="sub-link-page" style="color: white; text-decoration: underline;">${registerStr}</a></p>
				</div>
			</form>
		</div>
	`;
}