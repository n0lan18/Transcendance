import { generateNavigator } from "./nav.js";
import { loadContent } from "./utils.js";
import { translation } from "./translate.js";
import { getUserInfo } from "./utils.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";

export async function loadFriendsPage()
{
	let userInfo = await getUserInfo();
	console.log(userInfo);
	let friendsHTML = generateFriendsPageHTML();
	loadContent(friendsHTML, "friends", true);
	document.getElementById("app").innerHTML = generateFriendsPageHTML();
	await translation();
	
	addNavigatorEventListeners();

	addNumberOnlinePlayer(userInfo.friends);

	displayFriends(userInfo.friends);
}

function addNumberOnlinePlayer(friends)
{
	console.log(friends)
	const element = document.querySelector('[data-translate-key="online"]');
	console.log(element.textContent)
	element.textContent += '- ';
	element.textContent += friends.length;
}

function displayFriends(friends)
{
	let friendsDiv = document.getElementById("friends-online")
	if (friendsDiv)
	{
		friendsDiv.innerHTML = '';

		friends.forEach(friend => {
			const friendElement = document.createElement('div');
			friendElement.classList.add('friend');

			const friendName = document.createElement('span');
			friendName.textContent = friend.username;

			const friendPhoto = document.createElement('img');
			friendPhoto.src = friend.profile_photo;

			friendElement.appendChild(friendPhoto);
			friendElement.appendChild(friendName);

			friendsDiv.appendChild(friendElement);
		});
	}
}

function generateFriendsHTML()
{
	return `
		<div class="friends-container">
			<h1 data-translate-key="friends"></h1>
			<div class="list-friends-online">
				<h2 data-translate-key="online"></h2>
				<div id="friends-online" class="firends-online"></div>
			</div>
		</div>
	`
}

function generateFriendsPageHTML()
{
	const nav = generateNavigator();
	let body = generateFriendsHTML();

	return (nav + body);
}