import { loadContent } from "./utils.js";
import { generateNavigator } from "./nav.js";
import { fetchUserInfo } from "./utils.js";

export async function loadHomePage()
{
	let userInfo = await fetchUserInfo();
	console.log(userInfo);

	let homeHTML = generateHomePageHTML(userInfo);

	loadContent(homeHTML, "home", true);
	document.getElementById("app").innerHTML = generateHomePageHTML(userInfo);
}

function generateBodyHomePageHTML()
{
	let profilStr = "Profile";
	let settingsStr = "Settings";
	let soloStr = "Solo";
	let multiplayerStr = "Multiplayer";
	let onlineStr = "Online";
	return `
		<div class="flex-container">
				<button class="flex-item box1">
					<img src="../images/profile-logo-white.png" alt="logo profile" width="70" height="70">
					<div class="item-name"
						<h1>${profilStr}</h1>
					</div>
				</button>
				<button class="flex-item box2">
					<img src="../images/settings-logo-white.png" alt="logo settings" width="70" height="70">
					<div class="item-name"
						<h1>${settingsStr}</h1>
					</div>
				</button>
				<button class="flex-item box3">
					<img src="../images/solo-logo-white.png" alt="logo solo" width="175" height="175">
					<div class="item-name"
						<h1>${soloStr}</h1>
					</div>
				</button>
				<button class="flex-item box4">
					<img src="../images/multiplayer-logo-white.png" alt="logo multiplayer" width="100" height="100">
					<div class="item-name"
						<h1>${multiplayerStr}</h1>
					</div>
				</button>
				<button class="flex-item box5">
					<img src="../images/online-logo-white.png" alt="logo online" width="100" height="100">
					<div class="item-name"
						<h1>${onlineStr}</h1>
					</div>
				</button>
		</div>
	`;
}

function generateHomePageHTML(userInfo)
{
	let nav = generateNavigator(userInfo.username);
	let body = generateBodyHomePageHTML();
	return (nav + body);
}

