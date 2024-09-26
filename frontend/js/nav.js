
export function generateNavigator(userInfo)
{
	let username;

	if (userInfo.username === "")
		username = "Gest";
	else
		username = userInfo;
	let logoutStr = "Logout";
	let settingsStr = "Settings";

	return `
		<div class="container-nav container-nav-smartphone">
			<nav class="navbar">
				<ul class="nav-item nav-item-smartphone">
					<li class="box-nav box-nav-smartphone1">
						<h1 class="username-nav">${username}</h1>
					</li>
					<li class="box-nav box-nav-smartphone2">
						<button id="settings-button" class="button-center-items" style="color: #b3b3b3">
							<i class="fa-solid fa-gears image-nav" style="margin-top: 5px; color: #b3b3b3"></i>
							<p style="font-size: 15px">${settingsStr}</p>
						</button>
					</li>
					<li class="box-nav box-nav-smartphone3">
						<button class="button-center-items" style="color: #b3b3b3" id="logoutLink">
							<i class="fa-solid fa-right-from-bracket image-nav" style="margin-top: 5px; color: #b3b3b3"></i>
							<p style="font-size: 15px">${logoutStr}</p>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	`;
}