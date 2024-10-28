import { loadAuthentificationPage } from "../auth.js";
import { loadHomePage } from "../home.js";
import { loadSettingsPage } from "../settings.js";

export function addNavigatorEventListeners()
{
	switchPageToSettings();
	switchPageToHome();
	switchPageToLogout();
}

function switchPageToSettings()
{
	let switchPageToSettings = document.getElementById("settings-button");
	if (switchPageToSettings)
	{
		switchPageToSettings.addEventListener('click', function (event) {
			event.preventDefault();
			loadSettingsPage();
		});
	}
}

function switchPageToHome()
{
	let switchPageToHome = document.getElementById("home-button");
	if (switchPageToHome)
	{
		switchPageToHome.addEventListener('click', function (event) {
			event.preventDefault();
			loadHomePage();
		});
	}
}

function switchPageToLogout()
{
	let switchPageToLogout = document.getElementById("logoutLink");
	if (switchPageToLogout)
	{
		switchPageToLogout.addEventListener('click', function (event) {
			localStorage.removeItem('jwt_token');
			event.preventDefault();
			loadAuthentificationPage();
		});
	}
}