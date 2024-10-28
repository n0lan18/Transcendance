export function generateNavigator()
{
	let logoutStr = "Logout";
	let settingsStr = "Settings";
	let homeStr = "Home";
	return `
		<div class="container-nav">
			<nav class="navbar">
				<ul class="nav-item">
					<li class="box-nav-smartphone1">
						<button id="home-button" class="button-center-items" style="color: #b3b3b3">
							<i class="fa-solid fa-house image-nav" style="margin-top: 5px; color: #b3b3b3"></i>
							<p style="font-size: 15px">${homeStr}</p>
						</button>
					</li>
					<li class="box-nav-smartphone2">
						<button id="settings-button" class="button-center-items" style="color: #b3b3b3">
							<i class="fa-solid fa-gears image-nav" style="margin-top: 5px; color: #b3b3b3"></i>
							<p style="font-size: 15px">${settingsStr}</p>
						</button>
					</li>
					<li class="box-nav-smartphone3">
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