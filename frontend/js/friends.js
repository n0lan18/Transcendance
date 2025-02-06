import { generateNavigator } from "./nav.js";
import { addFriend, removeFriend, connectedUsersList, loadContent, removeElementWithDelay } from "./utils.js";
import { translation } from "./translate.js";
import { getUserInfo, isUserInList } from "./utils.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { loadStatsPage } from "./stats.js";

window.idStat = 0;

export async function loadFriendsPage()
{
	let friendsHTML = generateFriendsPageHTML();
	loadContent(document.getElementById("app"), friendsHTML, "friends", true, 'Friends Page', translation, addNavigatorEventListeners, addEventListenerFriendsPage);
	document.getElementById("app").innerHTML = generateFriendsPageHTML();
	await translation();
	
	addNavigatorEventListeners();

	addEventListenerFriendsPage();
}

export async function addEventListenerFriendsPage()
{
	const friendsTemplate = (index, image, username, statusButton) => {
		return `
			<div class="friends-line" id="friends-line${index + 1}">
				<div class="img-username-user" id="img-username-user">
					<img id="img-friends${index + 1}" class="superhero-image" src="${image}" alt="Profile image" style="width: 35px; height: 35px; border-radius: 10px;">
					<span class="status-indicator ${statusButton}"></span>
					<h3 id="username-friend${index + 1}" class="username-user">${username}</h3>
				</div>	
				<div class="follow-user-button">
					<button class="button-center-items" id="button-profile${index + 1}" style="margin-right: 10px; color: #b3b3b3" id="logoutLink">
						<i class="fa-solid fa-chart-line image-nav" color: #b3b3b3"></i>
						<p style="font-size: 15px">Stats</p>
					</button>
                	<input id="send-follow-user-button${index + 1}" value="Unfollow" class="btn btn-primary btn-block mb-4 send-unfollow-friend-button">
            	</div>
			</div>
		`;
		};

	const usersTemplate = (index, image, username, statusButton) => {
		return `
			<div class="friends-line" id="users-line${index + 1}">
				<div class="img-username-user" id="img-username-user">
					<img id="img-friends${index + 1}" class="superhero-image" src="${image}" alt="Profil image" style="width: 35px; height: 35px; border-radius: 10px;">
					<span class="status-indicator ${statusButton}"></span>
					<h3 id="username-friend${index + 1}" class="username-user">${username}</h3>
				</div>
				<div class="follow-user-button">
					<input id="send-follow-user-button${index + 1}" value="Follow" class="btn btn-primary btn-block mb-4 send-follow-friend-button">
				</div>
			</div>
			`;
		};


	const friendsButton = document.getElementById("friends-online-button");
	if (friendsButton)
	{
		friendsButton.addEventListener('click', async function() 
		{
			let userInfo = await getUserInfo();
			let userConnected = await connectedUsersList();
			friendsButton.style.backgroundColor = "rgb(100, 99, 99, 0.3)"
			document.getElementById("user-online-button").style.backgroundColor = "transparent";
			document.getElementById('list-users-online-container').innerHTML = '';
			document.getElementById('list-friends-online-container').style = "display: flex";
			const listUsersOnlineContainer = document.getElementById("list-friends-online-container");
			let buttonUnfollowFriend;
			if (listUsersOnlineContainer)
			{
				if (userInfo.friends.length == 0)
					listUsersOnlineContainer.innerHTML = `<h3 style="margin-top:10px">No friend yet</h3>`;
				else
				{
					if (!document.getElementById('list-users-online'))
					{
						for (let i = 0; i < userInfo.friends.length; i++)
						{
							if (userInfo.friends[i].isConnect == true && isUserInList(userConnected.connected_users, userInfo.friends[i].username) == true)
							{
								const userLine = document.createElement('div');
								userLine.className = "list-users-online";
								userLine.id = "list-users-online";
								userLine.innerHTML = friendsTemplate(i, userInfo.friends[i].profile_photo, userInfo.friends[i].username, "btn-success");
								listUsersOnlineContainer.appendChild(userLine);
								buttonUnfollowFriend = document.getElementById(`send-follow-user-button${i + 1}`);
								if (buttonUnfollowFriend)
								{
									buttonUnfollowFriend.addEventListener('click', async function() {
										buttonUnfollowFriend.classList.remove("btn-primary");
										buttonUnfollowFriend.classList.add("btn-success");
										buttonUnfollowFriend.value = "✓";
										await removeFriend(userInfo.friends[i].id)
										removeElementWithDelay(`friends-line${i + 1}`, 1500);
										userInfo = await getUserInfo();
										if (userInfo.friends.length == 0)
											listUsersOnlineContainer.innerHTML = `<h3 style="margin-top:10px">No friend yet</h3>`;
									});
								}
								const buttonProfilePage = document.getElementById(`button-profile${i + 1}`);
								if (buttonProfilePage)
								{
									buttonProfilePage.addEventListener('click', function () {
										window.idStat = userInfo.friends[i].id
										loadStatsPage(userInfo.friends[i].id);
									})
								}
							}
						}
						for (let i = 0; i < userInfo.friends.length; i++)
						{
							if (userInfo.friends[i].isConnect == false && isUserInList(userConnected.connected_users, userInfo.friends[i].username) == false)
							{
								const userLine = document.createElement('div');
								userLine.className = "list-users-online";
								userLine.innerHTML = friendsTemplate(i, userInfo.friends[i].profile_photo, userInfo.friends[i].username, "btn-danger");
								listUsersOnlineContainer.appendChild(userLine);
								buttonUnfollowFriend = document.getElementById(`send-follow-user-button${i + 1}`);
								if (buttonUnfollowFriend)
								{
									buttonUnfollowFriend.addEventListener('click', async function() {
										buttonUnfollowFriend.classList.remove("btn-primary");
										buttonUnfollowFriend.classList.add("btn-success");
										buttonUnfollowFriend.value = "✓";
										await removeFriend(userInfo.friends[i].id)
										removeElementWithDelay(`friends-line${i + 1}`, 1500);
										userInfo = await getUserInfo();
										if (userInfo.friends.length == 0)
											listUsersOnlineContainer.innerHTML = `<h3 style="margin-top:10px">No friend yet</h3>`;
									});
								}
							}
						}
					}
				}
			}
		})
	}

	const usersButton = document.getElementById("user-online-button");
	if (usersButton)
	{
		usersButton.addEventListener('click', async function() {
			let userInfo = await getUserInfo();
			let userConnected = await connectedUsersList();
			usersButton.style.backgroundColor = "rgb(100, 99, 99, 0.3)"
			document.getElementById("friends-online-button").style.backgroundColor = "transparent"
			document.getElementById('list-friends-online-container').style.backgroundColor = "black"
			document.getElementById('list-friends-online-container').innerHTML = '';
			document.getElementById('list-users-online-container').style = "display: flex";
			const listUsersOnlineContainer = document.getElementById("list-users-online-container");
			if (listUsersOnlineContainer)
			{
				if ((userConnected.connected_users.length - userInfo.friends.length) == 1)
					listUsersOnlineContainer.innerHTML = `<h3 style="margin-top:10px">No user connected</h3>`;
				else
				{
					if (!document.getElementById(`list-users-online`))
					{
						for (let i = 0; i < userConnected.connected_users.length; i++)
						{
							if (isUserInList(userInfo.friends, userConnected.connected_users[i].username) == false && userInfo.username != userConnected.connected_users[i].username)
							{
								const userLine = document.createElement('div');
								userLine.className = "list-users-online";
								userLine.id = `list-users-online`;
								userLine.innerHTML = usersTemplate(i, userConnected.connected_users[i]["profile-photo"], userConnected.connected_users[i].username, "btn-success");
								listUsersOnlineContainer.appendChild(userLine);
								const buttonFollowFriend = document.getElementById(`send-follow-user-button${i + 1}`);
								if (buttonFollowFriend)
								{
									buttonFollowFriend.addEventListener('click', async function() {
										buttonFollowFriend.classList.remove("btn-primary");
										buttonFollowFriend.classList.add("btn-success");
										buttonFollowFriend.value = "✓";
										buttonFollowFriend.disable = true;
										await addFriend(userConnected.connected_users[i].id);
										removeElementWithDelay(`users-line${i + 1}`, 1500);
										userConnected = await connectedUsersList();
										userInfo = await getUserInfo();
										if ((userConnected.connected_users.length - userInfo.friends.length) == 1)
											listUsersOnlineContainer.innerHTML = `<h3 style="margin-top:10px">No user connected</h3>`;
									});
								}
							}
						}							
					}
				}
			}
		})
	}
	document.getElementById("friends-online-button").click();
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/friends")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Friends Page', translation, addNavigatorEventListeners, addEventListenerFriendsPage);
	}
});

function generateFriendsHTML()
{
	return `
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="friends-container">
			<h1 data-translate-key="friends"></h1>
			<div class="button-users">
				<div class="friends-online-button-container" id="friends-online-button-container">
					<button id="friends-online-button" class="friends-button-online">
						<div class="item-name button-page-friends"
							<h1 data-translate-key="friends"></h1>
						</div>
					</button>
				</div>
				<div class="user-online-button-container" id="user-online-button-container">
					<button id="user-online-button" class="user-online-button">
						<div class="item-name button-page-friends"
							<h1 data-translate-key="user-online"></h1>
						</div>
					</button>
				</div>
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