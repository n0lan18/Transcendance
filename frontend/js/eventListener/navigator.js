import { loadAuthentificationPage } from "../auth.js";
import { loadHomePage } from "../home.js";
import { reorderLanguages, translation, changeLanguage } from "../translate.js";

export function addNavigatorEventListeners()
{
	const lang = localStorage.getItem('language') || 'en';
	switchPageToHome();
	switchPageToLogout();
	reorderLanguages(lang);

	document.getElementById('language-select').addEventListener('change', (event) => {
		changeLanguage(event.target.value);
		translation(event.target.value)
	});
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


