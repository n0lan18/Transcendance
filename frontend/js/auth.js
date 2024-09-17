import { loadRegisterPage } from "./register.js";
import { loadHomePage } from "./home.js";

export function loadAuthentificationPage()
{
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

    let switchPageLoginToRegister = document.getElementById("switchPageLoginToRegister");
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
				}
			} catch (error) {
				console.error('Error:', error);
				console.log('An error occured.');
			}
		});
	}
}

function generateAuthentificationHTML()
{
    let principalStr = "I've an account";
    let emailUsernameStr = "Username or e-mail adress";
	let passwordStr = "Password";
	let buttonStr = "Send";
	let accountStr = "Don't you have account ?";
	let registerStr = "Registrer to Pong";
    return `
        <div id="authentification">
            <h1>${principalStr}</h1>
            <form id=authForm>
                <div id="loginPlace">                  
                    <label for="usernameEmailLogin">${emailUsernameStr}</label><br>
                    <input type="text" id="usernameEmailLogin" name="usernameEmailLogin" autocomplete="userEmailLogin" placeholder="${emailUsernameStr}" required><br>
                    <label for="passwordLogin">${passwordStr}</label><br>
                    <input type="password" id="passwordLogin" name="passwordLogin" autocomplete="new-password" placeholder="${passwordStr}" required><br>
                </div>
                <input type="submit" value="${buttonStr}">
            </form>
            <div id="redirectToRegisterPage">
                <p>${accountStr}</p>
                <a id=switchPageLoginToRegister href="#register">${registerStr}</a>
            </div>
        </div>
    `;
}