import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { generateNavigator } from "./nav.js";
import { translation } from "./translate.js";
import { loadContent } from "./utils.js";
import { errorPasswordForm, checkPasswordForm } from "./register/password-register.js";
import { escapeHTML } from "./utils.js";
import { getCookie } from "./utils.js";

export async function loadProfilePage()
{
	let profileHTML = generateProfilePageHTML();

	loadContent(document.getElementById("app"), profileHTML, "profile", true, "Profile Page", translation, addNavigatorEventListeners, addEventListenerProfile);
	document.getElementById("app").innerHTML = generateProfilePageHTML();
	
	translation();
	addNavigatorEventListeners()
	addEventListenerProfile()
}

window.addEventListener('popstate', function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/profile")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, "Profile Page", translation, addNavigatorEventListeners, addEventListenerProfile)
	}
});

export function addEventListenerProfile()
{
	let profileForm = document.getElementById('profileForm');
	if (profileForm)
	{
		profileForm.addEventListener('submit', function(event)
		{
			event.preventDefault();
	
			const formData = new FormData();
			const profilePicture = document.getElementById('profile_picture').files[0];
			if (profilePicture)
			{
				formData.append('image', profilePicture);
				updateImageToDatabase(formData);
			}
		});
	}

	let passwordUpdateForm = document.getElementById("passwordForm");
	if (passwordUpdateForm) {
		passwordUpdateForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const passwordInput = document.getElementById("passwordUpdate");
			const data = {
				password: passwordInput.value,
			};

			const letterRegex = /[a-zA-Z]/;
			const numberOrSpecialCharRegex = /[0-9.#?!&]/;
			const minCharacterRegex = /^.{10,}$/;

			if (
				letterRegex.test(passwordInput.value) &&
				numberOrSpecialCharRegex.test(passwordInput.value) &&
				minCharacterRegex.test(passwordInput.value)
			) {
				updateDataToDatabase(data, "password");
			} else {
				// Affiche les erreurs si les conditions ne sont pas remplies
				if (document.getElementById("newPasswordValidate"))
					document.getElementById("newPasswordValidate").remove();
				if (!letterRegex.test(passwordInput.value)) {
					errorPasswordForm(document.getElementById("check-letter-password"));
				}
				if (!numberOrSpecialCharRegex.test(passwordInput.value)) {
					errorPasswordForm(document.getElementById("check-num-or-special-character-password"));
				}
				if (!minCharacterRegex.test(passwordInput.value)) {
					errorPasswordForm(document.getElementById("check-number-characters-password"));
				}
				let buttonSend = document.getElementById("update-password-button");
				buttonSend.classList.remove("btn-success");
				buttonSend.classList.add("btn-danger");
			}
		});
	}

	const togglePasswordButton = document.getElementById("togglePassword");
	const passwordInput = document.getElementById("passwordUpdate");
	if (togglePasswordButton && passwordInput) {
		togglePasswordButton.addEventListener("click", () => {
			const toggleIcon = togglePasswordButton.querySelector("i");
			if (passwordInput.type === "password") {
				passwordInput.type = "text";
				toggleIcon.classList.remove("fa-eye-slash");
				toggleIcon.classList.add("fa-eye");
			} else {
				passwordInput.type = "password";
				toggleIcon.classList.remove("fa-eye");
				toggleIcon.classList.add("fa-eye-slash");
			}
		});
	}

	let passwordField = document.getElementById("passwordUpdate");
	if (passwordField) {
		passwordField.addEventListener("input", () => {
			let passwordValue = passwordField.value;
			const letterRegex = /[a-zA-Z]/;
			const numberOrSpecialCharRegex = /[0-9.#?!&]/;
			const minCharacterRegex = /^.{10,}$/;

			checkPasswordForm(letterRegex, passwordValue, document.getElementById("check-letter-password"));
			checkPasswordForm(numberOrSpecialCharRegex, passwordValue, document.getElementById("check-num-or-special-character-password"));
			checkPasswordForm(minCharacterRegex, passwordValue, document.getElementById("check-number-characters-password"));
		});
	}

	let emailRegister = document.getElementById("emailForm");
	if (emailRegister)
	{
		emailRegister.addEventListener("submit", async (event) =>
		{
			event.preventDefault();
			const email = document.getElementById("emailUpdate");
			const data = {
				email: email.value,
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
			if (emailRegex.test(email.value))
			{
				if (await checkEmailIfExist(data, email));
					await updateDataToDatabase(data, "email")
			}
			else
			{
				let registerPlace = document.getElementById("email-update-container");
				if (document.getElementById("newEmailValidate"))
					document.getElementById("newEmailValidate").remove();
				if (!document.getElementById('badEmail'))
				{
					let item = document.createElement('p');
					item.id = "badEmail";
					item.textContent = 'Invalid email';
					item.classList.add("invalid-register");
					registerPlace.appendChild(item);
					let buttonSend = document.getElementById("update-email-button");
					buttonSend.classList.remove('btn-success');
					buttonSend.classList.add('btn-danger');
				}
			}
		});
	}

	let usernameUpdate = document.getElementById("usernameForm");
	if (usernameUpdate)
	{
		usernameUpdate.addEventListener("submit", async (event) =>
		{
			event.preventDefault();
			let username = document.getElementById("usernameUpdate");
			username = escapeHTML(username.value);
			const data = {
				username: username,
			}
			await checkUsernameIfExist(data, username);
		});
	}
}

async function updateImageToDatabase(data)
{
	try
	{
		const response = await fetch(`api/update-image/`, {
			method: "PUT",
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
			},
			body: data,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();
		console.log('Success:', result);
	}
	catch (error)
	{
		console.error('Error:', error);
	}
}

async function updateDataToDatabase(data, typeData)
{
	try {
		let link;
		if (typeData == "password")
			link = "api/update-password/";
		else if (typeData == "username")
			link = "api/update-username/";
		else if (typeData == "email")
			link = "api/update-email/";
		const response = await fetch(`${link}`, {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		else
		{
			if (typeData == "email")
			{
				if (document.getElementById("emailExist"))
					document.getElementById("emailExist").remove();
				let item = document.getElementById("email-update-container");
				if (!document.getElementById("newEmailValidate"))
				{
					let newEmailValidate = document.createElement("p");
					newEmailValidate.id = "newEmailValidate";
					newEmailValidate.classList.add("valid-password");
					newEmailValidate.textContent = 'Successful new e-mail';
					item.appendChild(newEmailValidate);
					let buttonSend = document.getElementById("update-email-button");
					buttonSend.classList.remove('btn-danger');
					buttonSend.classList.add('btn-success');
				}
			}
			else if (typeData == "username")
			{
				if (document.getElementById("usernameExist"))
					document.getElementById("usernameExist").remove();
				let item = document.getElementById("username-update-container");
				if (!document.getElementById("newUsernameValidate"))
				{
					let newUsernameValidate = document.createElement("p");
					newUsernameValidate.id = "newUsernameValidate";
					newUsernameValidate.classList.add("valid-password");
					newUsernameValidate.textContent = 'Successful new username';
					item.appendChild(newUsernameValidate);
					let buttonSend = document.getElementById("update-username-button");
					buttonSend.classList.remove('btn-danger');
					buttonSend.classList.add('btn-success');
				}				
			}
			else if (typeData == "password")
			{
				if (document.getElementById("badPassword"))
					document.getElementById("badPassword").remove();
				let item = document.getElementById("password-update-container");
				if (!document.getElementById("newPasswordValidate"))
				{
					let newPasswordValidate = document.createElement("p");
					newPasswordValidate.id = "newPasswordValidate";
					newPasswordValidate.classList.add("valid-password");
					newPasswordValidate.textContent = 'Successful new password';
					item.appendChild(newPasswordValidate);
					let buttonSend = document.getElementById("update-password-button");
					buttonSend.classList.remove('btn-danger');
					buttonSend.classList.add('btn-success');
				}					
			}
		}
		const result = await response.json();

	} catch (error) {
		console.error('Error:', error);
	}
}

async function checkEmailIfExist(data)
{
	const dataCopy = data;
	const csrftoken = getCookie('csrftoken');
	await fetch('api/check-email/', {
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
				let item = document.getElementById("email-update-container");
				if (document.getElementById("newEmailValidate"))
					document.getElementById("newEmailValidate").remove();
				if (!document.getElementById("emailExist"))
				{
					let emailExist = document.createElement("p");
					emailExist.id = "emailExist";
					emailExist.classList.add("invalid-register");
					emailExist.textContent = 'This email address already exists';
					item.appendChild(emailExist);
					let buttonSend = document.getElementById("update-email-button");
					buttonSend.classList.remove('btn-success');
					buttonSend.classList.add('btn-danger');
				}
				throw new Error(data.message || "Something went wrong");
			});
		}
		return response.json();
	})
	.then((data) => {
		return null;
	})
	.catch(error => {
		console.error('Error:', error);
	})
}

async function checkUsernameIfExist(data)
{
	const dataCopy = data;
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
				let item = document.getElementById("username-update-container");
				if (document.getElementById("newUsernameValidate"))
					document.getElementById("newUsernameValidate").remove();
				if (!document.getElementById("usernameExist"))
				{
					let usernameExist = document.createElement("p");
					usernameExist.id = "usernameExist";
					usernameExist.classList.add("invalid-register");
					usernameExist.textContent = 'This username already exists';
					item.appendChild(usernameExist);
					let buttonSend = document.getElementById("update-username-button");
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
			updateDataToDatabase(dataCopy, "username");
	})
	.catch(error => console.error('Error:', error));
}

function generateBodyProfilePageHTML()
{
	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="profile-container">
			<h1 class="text-center" data-translate-key="profile"></h1>
			<div class="profile-image-update-container">
				<h2 data-translate-key="updateProfilImage"></h2>
    			<form class="profile-form" id="profileForm" enctype="multipart/form-data">
					<input type="file" class="profile-picture button-send-profile" id="profile_picture" name="profile_picture" accept="image/*" required/>
					<button class="btn btn-success btn-block mb-4 update-image-button button-send-profile" id="update-image-button" data-translate-key="update" type="submit"></button>
				</form>
			</div>
			<div class="email-update-container" id="email-update-container">
				<h2 data-translate-key="updateEmail"></h2>
				<form class="email-form" id="emailForm">
					<div class="email-place" id="emailPlace" data-mdb-input-init class="form-outline mb-4">
						<div class="form-item">
							<input type="text" id="emailUpdate" name="emailUpdate" autocomplete="email" data-translate-key="email" placeholder="" required class="form-control button-send-profile"/>
						</div>
						<div class="button-send-profile">
							<input type="submit" data-translate-key="updateInput" value="" class="btn btn-success btn-block mb-4" id="update-email-button">
							<span id="result-email-update"></span>
						</div>
					</div>
				</form>
			</div>
			<div class="username-update-container" id="username-update-container">
				<h2 data-translate-key="updateUsername"></h2>
				<form class="username-form" id="usernameForm">
					<div class="username-place" id="usernamePlace" data-mdb-input-init class="form-outline mb-4">
						<div class="form-item">
							<input type="text" id="usernameUpdate" name="usernameUpdate" autocomplete="usernameUpdate" data-translate-key="username" placeholder="" required class="form-control button-send-profile"/>
						</div>
						<div class="button-send-profile">
							<input type="submit" data-translate-key="updateInput" value="" class="btn btn-success btn-block mb-4" id="update-username-button">
							<span id="result-username-update"></span>
						</div>
					</div>
				</form>
			</div>
			<div class="password-update-container" id="password-update-container">
				<h2 data-translate-key="updatePassword"></h2>
				<form class="password-form" id="passwordForm">
					<div class="password-place" id="passwordPlace" data-mdb-input-init class="form-outline mb-4">
						<div id="input-password" class="profile-input-password">
							<input type="password" id="passwordUpdate" name="passwordUpdate" autocomplete="new-password" data-translate-key="password" placeholder="" required class="form-control"  style="padding-right: 40px;" />
							<button type="button" class="toggle-password" id="togglePassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #b3b3b3; padding: 0;">
								<i class="fa-solid fa-eye-slash"></i>
							</button>
						</div>
						<ul class="list-password">
							<div id="check-letter-password">
								<i class="fa-solid fa-circle" style="font-size: 10px;"></i>
								<span data-translate-key="password1"></span>
							</div>
							<div id="check-num-or-special-character-password">
								<i class="fa-solid fa-circle" style="font-size: 10px;"></i>
								<span data-translate-key="password2"></span>
							</div>
							<div id="check-number-characters-password">
								<i class="fa-solid fa-circle" style="font-size: 10px;"></i>
								<span data-translate-key="password3"></span>
							</div>
						</ul>
						<div class="button-send-profile">
							<input type="submit" data-translate-key="updateInput" value="" class="btn btn-success btn-block mb-4" id="update-password-button">
							<span id="result-password-update"></span>
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
}

export function generateProfilePageHTML()
{
	let nav = generateNavigator();
	let body = generateBodyProfilePageHTML();

	return (nav + body);
}