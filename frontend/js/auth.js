import { loadHomePage } from "./home.js";
import { getCookie, loadContent } from "./utils.js";
import { loadRegisterEmailPage } from "./register/email-register.js"
import { addRoute } from "./router.js";

export function loadAuthentificationPage()
{
	addRoute('/login', { loadFunction: loadAuthentificationPage });
	history.replaceState({}, '', window.location.href);
		
	let authHTML = generateAuthentificationHTML();
	loadContent(document.getElementById("app"), authHTML, "login", true, 'Authentification Page', "", "", addEventListenerAuthPage);
    document.getElementById("app").innerHTML = generateAuthentificationHTML();

	const switchHidePasswordToSee = document.getElementById("input-password");
	if (switchHidePasswordToSee)
	{
		const buttonChange = document.getElementById("togglePassword");
		const toggleIcon = buttonChange.querySelector('i');
		const passwordInput = document.getElementById("passwordLogin");
		buttonChange.addEventListener('click', function () {
			if (passwordInput.type === 'password') {
				passwordInput.type = 'text';
				toggleIcon.classList.remove('fa-eye-slash');
				toggleIcon.classList.add('fa-eye'); // Change l'icône en œil barré
			} else {
				passwordInput.type = 'password';
				toggleIcon.classList.remove('fa-eye');
				toggleIcon.classList.add('fa-eye-slash'); // Change l'icône en œil ouvert
			}
		})
	}

	addEventListenerAuthPage()

}

export function addEventListenerAuthPage()
{
    let champsEmail = document.getElementById("usernameEmailLogin");
	if (champsEmail)
	{
    	champsEmail.addEventListener("input",
    	(event) =>
    	{
    	    let usernameValue = champsEmail.value;
    	});
	}

    let champsPassword = document.getElementById("passwordLogin");
	if (champsPassword)
	{
    	champsPassword.addEventListener("input",
    	(event) =>
    	{
    	    let passwordValue = champsPassword.value;
    	});
	}

    let switchPageLoginToRegister = document.getElementById("sub-link-page");
	if (switchPageLoginToRegister)
	{
		switchPageLoginToRegister.addEventListener("click",
	    (event) =>
	    {
	        event.preventDefault();
			loadRegisterEmailPage();
	    });
	}

	checkConnexion();
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
				return ;
			}
			const credentials = {
				emailUsername: emailUsername,
				password: password,
			};
			try
			{
				const csrftoken = getCookie('csrftoken')
				const response = await fetch('api/login/', {
					method: 'POST',
					headers: {
						'Content-Type' : 'application/json',
						'X-CSRFToken': csrftoken,
					},
					body: JSON.stringify(credentials),
				});
				if (response.ok)
				{
					const data = await response.json();
					const token = data.access;

					localStorage.setItem('jwt_token', token);
					history.replaceState({}, '', '/home');		
					loadHomePage();
				}
				else
				{
					const errorData = await response.json();
					let authForm = document.getElementById("loginPlace");
					if (!document.getElementById("badLogin"))
					{
						let badLogin = document.createElement("p");
						badLogin.id = "badLogin";
						badLogin.classList.add('invalid-register', 'badLogin');
						badLogin.textContent = 'Access denied: Bad informations enter';
						authForm.appendChild(badLogin);
						const button = document.getElementById('buttonLogin');
						button.classList.remove('btn-success');
						button.classList.add('btn-danger');
					}	
				}
			} catch (error) {
				console.error('Error:', error);
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
	let forgotPassword = "Forgot password?";
	return `
		<div id="authentification" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
			<form id=authForm>
				<div class="text-center">
					<h1 style="color: white;">${principalStr}</h1>
				</div>
				<div id="loginPlace" data-mdb-input-init class="form-outline mb-4">
					<div class="form-item">
						<label for="usernameEmailLogin" class="form-label">${emailUsernameStr}</label>
						<input type="text" id="usernameEmailLogin" name="usernameEmailLogin" autocomplete="userEmailLogin" placeholder="${emailUsernameStr}" required class="form-control" />
					</div>
					<label for="passwordLogin" class="form-label">${passwordStr}</label>
					<div id="input-password" style="position: relative;">
						<input type="password" id="passwordLogin" name="passwordLogin" autocomplete="new-password" placeholder="${passwordStr}" required class="form-control"  style="padding-right: 40px;" />
						<button type="button" class="toggle-password" id="togglePassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #b3b3b3; padding: 0;">
							<i class="fa-solid fa-eye-slash"></i>
						</button>
					</div>
				</div>				
				<input id="buttonLogin" type="submit" value="${buttonStr}" class="btn btn-success btn-block mb-4">
				<div class="text-center">
					<div class="form-item">
						<a href="#!" style="color: white; text-decoration: underline">${forgotPassword}</a>
					</div>
					<p style="color: #b3b3b3">${accountStr} <a href="#register-email" id="sub-link-page" style="color: white; text-decoration: underline;">${registerStr}</a></p>
				</div>
			</form>
		</div>
	`;
}