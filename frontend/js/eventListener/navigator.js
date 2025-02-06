import { loadAuthentificationPage } from "../auth.js";
import { loadHomePage } from "../home.js";
import { reorderLanguages, translation, changeLanguage } from "../translate.js";
import { loadFriendsPage } from "../friends.js";
import { removeUserInPlayerOnline } from "../utils.js";

export function addNavigatorEventListeners()
{
	const lang = localStorage.getItem('language') || 'en';
	switchPageToHome();
	switchPageToLogout();
	switchPageToFriends()
	reorderLanguages(lang);

	const languageSelect = document.getElementById('language-select');
	if (languageSelect)
	{
		languageSelect.addEventListener('change', (event) => {
			changeLanguage(event.target.value);
			translation(event.target.value)
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

function switchPageToFriends()
{
	let switchPageToFriends = document.getElementById('friends-button');
	if (switchPageToFriends)
	{
		switchPageToFriends.addEventListener('click', function (event)
		{
			event.preventDefault();
			loadFriendsPage();
		});
	}
}

function switchPageToLogout()
{
	let switchPageToLogout = document.getElementById("logoutLink");
	if (switchPageToLogout)
	{
		switchPageToLogout.addEventListener('click', async function (event) {
			await removeUserInPlayerOnline();
			localStorage.removeItem('jwt_token');
			event.preventDefault();
			loadAuthentificationPage();
		});
	}
}


