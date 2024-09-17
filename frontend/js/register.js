import { loadAuthentificationPage } from "./auth.js";

export function loadRegisterPage() {
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
    let emailStr = "E-mail address";  // Correction: "adress" -> "address"
    let passwordStr = "Password";
    let buttonStr = "Send";
    let accountStr = "Don't you have an account?";
    let loginStr = "Login to Pong";
    return `
        <div id="register">
            <h1>${principalStr}</h1>
            <form id="registerForm">
                <div id="RegisterPlace">
                    <label for="usernameRegister">${usernameStr}</label><br>
                    <input type="text" id="usernameRegister" name="usernameRegister" autocomplete="username" placeholder="${usernameStr}" required><br> 
                    <label for="emailRegister">${emailStr}</label><br>
                    <input type="text" id="emailRegister" name="emailRegister" autocomplete="email" placeholder="${emailStr}" required><br>
                    <label for="passwordRegister">${passwordStr}</label><br>
                    <input type="password" id="passwordRegister" name="passwordRegister" autocomplete="new-password" placeholder="${passwordStr}" required><br>  <!-- Correction: "password" -> "new-password" -->
                    <ul>
                        <li>1 letter</li>
                        <li>1 numeric or special character (e.g., #?!&)</li>
                        <li>10 characters</li>
                    </ul>
                </div>
                <button type="submit">${buttonStr}</button>
            </form>
            <div id="redirectToLoginPage">
                <p>${accountStr}</p>
                <a id="switchPageRegisterToLogin" href="#authentification">${loginStr}</a>
            </div>
        </div> 
    `;
}
