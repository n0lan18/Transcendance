import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { generateNavigator } from "./nav.js";
import { translation } from "./translate.js";
import { loadContent } from "./utils.js";
import { errorPasswordForm, checkPasswordForm } from "./register/password-register.js";
import { escapeHTML } from "./utils.js";

export async function loadProfilePage()
{

	let profileHTML = generateProfilePageHTML();

	loadContent(profileHTML, "profile", true);
	document.getElementById("app").innerHTML = generateProfilePageHTML();
	
	translation();
	addNavigatorEventListeners()

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
			console.log(data);

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

	let emailRegister = document.getElementById("emailForm");
	if (emailRegister)
	{
		emailRegister.addEventListener("submit", (event) =>
		{
			event.preventDefault();
			const email = document.getElementById("emailUpdate");
			console.log(email.value);
			const data = {
				email: email.value,
			}
			console.log(data.email);

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
			if (emailRegex.test(email.value))
			{
				let buttonSend = document.getElementById("update-email-button");
				buttonSend.classList.remove('btn-danger');
				buttonSend.classList.add('btn-success');
				updateDataToDatabase(data, "email", emailRegister);
			}
			else
			{
				let buttonSend = document.getElementById("update-email-button");
				buttonSend.classList.remove('btn-success');
				buttonSend.classList.add('btn-danger');
			}
		});

	}

	let usernameUpdate = document.getElementById("usernameForm");
	if (usernameUpdate)
	{
		usernameUpdate.addEventListener("submit", (event) =>
		{
			event.preventDefault();
			let username = document.getElementById("usernameUpdate");
			username = escapeHTML(username.value);
			const data = {
				username: username,
			}

			updateDataToDatabase(data, "username", usernameUpdate);
		});

	}	

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.page) {
			// Charger le contenu associé à la page
			loadContent(event.state.page, '', false); // Pas besoin d'ajouter à l'historique à nouveau
		}
	});
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

		const result = await response.json();

	} catch (error) {
		console.error('Error:', error);
	}

}

function generateBodyProfilePageHTML()
{
	return `
		<div class="profile-container">
			<h1 class="text-center" data-translate-key="profile"></h1>
			<div class="profile-image-update-container">
				<h2 data-translate-key="updateProfilImage"></h2>
    			<form class="profile-form" id="profileForm" enctype="multipart/form-data">
					<input type="file" class="profile-picture" id="profile_picture" name="profile_picture" accept="image/*" required/>
					<button class="btn btn-success btn-block mb-4 update-image-button" id="update-image-button" data-translate-key="update" type="submit" style="width: 50%;"></button>
				</form>
			</div>
			<div class="email-update-container" id="email-update-container">
				<h2 data-translate-key="updateEmail"></h2>
				<form class="email-form" id="emailForm">
					<div class="email-place" id="emailPlace" data-mdb-input-init class="form-outline mb-4">
						<div class="form-item">
							<input type="text" id="emailUpdate" name="emailUpdate" autocomplete="email" data-translate-key="email" placeholder="" required class="form-control" style="width: 25%;"/>
						</div>
						<div class="email-form-button">
							<input type="submit" data-translate-key="updateInput" value="" class="btn btn-success btn-block mb-4" id="update-email-button" style="width: 25%;">
							<span id="result-email-update"></span>
						</div>
					</div>
				</form>
			</div>
			<div class="username-update-container">
				<h2 data-translate-key="updateUsername"></h2>
				<form class="username-form" id="usernameForm">
					<div class="username-place" id="usernamePlace" data-mdb-input-init class="form-outline mb-4">
						<div class="form-item">
							<input type="text" id="usernameUpdate" name="usernameUpdate" autocomplete="usernameUpdate" data-translate-key="username" placeholder="" required class="form-control" style="width: 25%;"/>
						</div>
						<div class="username-form-button">
							<input type="submit" data-translate-key="updateInput" value="" class="btn btn-success btn-block mb-4" id="update-username-button" style="width: 25%;">
							<span id="result-username-update"></span>
						</div>
					</div>
				</form>
			</div>
			<div class="password-update-container">
				<h2 data-translate-key="updatePassword"></h2>
				<form class="password-form" id="passwordForm">
					<div class="password-place" id="passwordPlace" data-mdb-input-init class="form-outline mb-4">
						<div id="input-password" style="position: relative; width: 25%;">
							<input type="password" id="passwordUpdate" name="passwordUpdate" autocomplete="new-password" data-translate-key="password" placeholder="" required class="form-control"  style="padding-right: 40px;" />
							<button type="button" class="toggle-password" id="togglePassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #b3b3b3; padding: 0;">
								<i class="fa-solid fa-eye-slash"></i>
							</button>
						</div>
						<ul class="list-password">
							<div id="check-letter-password">
								<li data-translate-key="password1"><i class="fa-solid fa-circle" style="font-size: 10px;"></i></li>
							</div>
							<div id="check-num-or-special-character-password">
								<li data-translate-key="password2"><i class="fa-solid fa-circle" style="font-size: 10px;"></i></li>
							</div>
							<div id="check-number-characters-password">
								<li data-translate-key="password3"><i class="fa-solid fa-circle" style="font-size: 10px;"></i></li>
							</div>
						</ul>
						<div class="password-form-button">
							<input type="submit" data-translate-key="updateInput" value="" class="btn btn-success btn-block mb-4" id="update-password-button" style="width: 25%;">
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