import { generateNavigator } from "./nav.js";
import { addFriend, connectedUsersList, loadContent } from "./utils.js";
import { translation } from "./translate.js";
import { getUserInfo, isUserInList } from "./utils.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";

export async function loadFriendsPage()
{
	let userInfo = await getUserInfo();
	let userConnected = await connectedUsersList();
	console.log(userConnected)
	console.log(userInfo.friends)
	let friendsHTML = generateFriendsPageHTML();
	loadContent(friendsHTML, "friends", true);
	document.getElementById("app").innerHTML = generateFriendsPageHTML();
	await translation();
	
	addNavigatorEventListeners();

	const friendsTemplate = (index, image, username) => { 
		return `
			<div class="friends-line${index + 1}">
				<div class="img-user" id="img-user">
					<img id="img-friends${index + 1}" class="superhero-image" src="${image}" alt="Profile image" style="width: 10%; height: 10%; border-radius: 10px;">
				</div>	
				<div class="username-user" id="username-user">
					<h3 id="username-friend${index + 1}">${username}</h3>
				</div>
				<div class="btn btn-primary">
                	<button id="profile-page-friend-button${index}" class="color-button";"></button>
                	<p class="text-under-color-button" data-translate-key="follow"></p>
            	</div>
			</div>
		`;
		};

	const usersTemplate = (index, image, username) => {
		return `
			<div class="friends-line">
				<div class="img-username-user" id="img-username-user">
					<img id="img-friends${index + 1}" class="superhero-image" src="${image}" alt="Profil image" style="width: 15%; height: 15%; border-radius: 10px;">
					<h3 id="username-friend${index + 1}" class="username-user">${username}</h3>
				</div>
				<div class="follow-user-button">
					<input id="send-follow-user-button${index + 1}" data-translate-key="follow" value="" class="btn btn-success btn-block mb-4 send-preparation-game-button" style="width: 30%;">
				</div>
			</div>
			`;
		};

	const friendsButton = document.getElementById("friends-online-button");
	if (friendsButton)
	{
		friendsButton.addEventListener('click', function() {
			document.getElementById('list-users-online-container').style = "display: none";
			document.getElementById('list-friends-online-container').style = "display: flex";
			const listUsersOnlineContainer = document.getElementById("list-friends-online-container");
			if (listUsersOnlineContainer)
			{
				if (userInfo.friends.length == 0)
					listUsersOnlineContainer.innerHTML = `<h3 style="margin-top:10px">No friend yet</h3>`;
				else
				{
					const onlineStr = document.createElement("h2");
					onlineStr.id = "online-str";
					onlineStr.textContent = "Online";
					listUsersOnlineContainer.appendChild(onlineStr);
					addNumberOnlinePlayer(userInfo.friends);
					for (let i = 0; i < userInfo.friends.length; i++)
					{
						if (userInfo.friends[i].isConnected == true)
							listUsersOnlineContainer.innerHTML = friendsTemplate(i, userInfo.friends[i].profile_photo, userInfo.friends[i].username);
					}
				}
			}
		})
	}

	const usersButton = document.getElementById("user-online-button");
	if (usersButton)
	{
		usersButton.addEventListener('click', function() {
			document.getElementById('list-friends-online-container').style = "display: none";
			document.getElementById('list-users-online-container').style = "display: flex";
			const listUsersOnlineContainer = document.getElementById("list-users-online-container");
			if (listUsersOnlineContainer)
			{
				if (userConnected.connected_users.length == 0)
					listUsersOnlineContainer.innerHTML = `<h3 style="margin-top:10px">No user connected</h3>`;
				else
				{
					for (let i = 0; i < userConnected.connected_users.length; i++)
					{
						if (isUserInList(userInfo.friends, userConnected.connected_users[i].username) == false && userInfo.username != userConnected.connected_users[i].username)
						{
							const userLine = document.createElement('div');
							userLine.innerHTML = usersTemplate(i, userConnected.connected_users[i]["profile-photo"], userConnected.connected_users[i].username);
							listUsersOnlineContainer.appendChild(userLine);
							const buttonFollowFriend = document.getElementById(`send-follow-user-button${i + 1}`);
							if (buttonFollowFriend)
							{
								buttonFollowFriend.addEventListener('click', function() {
									addFriend(userConnected.connected_users[i].id)
								});
							}
						}
					}
				}
			}
		})
	}
	document.getElementById("friends-online-button").click();
}

function addNumberOnlinePlayer(friends)
{
	const element = document.querySelector('[data-translate-key="online"]');
	element.textContent += '- ';
	element.textContent += friends.length;
}

function generateFriendsHTML()
{
	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="friends-container">
			<div class="button-users">
				<button id="friends-online-button" class="friends-button-online">
					<div class="item-name"
						<h1 data-translate-key="friends"></h1>
					</div>
				</button>
				<button id="user-online-button" class="user-online-button">
					<div class="item-name"
						<h1 data-translate-key="user-online"></h1>
					</div>
				</button>
			</div>
			<div class="list-friends-online-container" id="list-friends-online-container"></div>
			<div class="list-users-online-container" id="list-users-online-container"></div>
		</div>
	`
}

function generateFriendsPageHTML()
{
	const nav = generateNavigator();
	let body = generateFriendsHTML();

	return (nav + body);
}