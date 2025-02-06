
export function generateNavigator()
{
	return `
		<div class="container-nav id="container-nav">
			<nav class="navbar">
				<ul class="nav-item">
					<li class="box-nav-smartphone1">
						<button id="home-button" class="button-center-items" style="color: #b3b3b3">
							<i class="fa-solid fa-house image-nav" style="margin-top: 5px; color: #b3b3b3"></i>
							<p style="font-size: 15px" data-translate-key="home"></p>
						</button>
					</li>
					<li class="box-nav-smartphone4">
						<button id="friends-button" class="button-center-items" style="color: #b3b3b3">
							<i class="fa-solid fa-user-group image-nav" style="margin-top: 5px; color: #b3b3b3"></i>
							<p style="font-size: 15px" data-translate-key="friends"></p>
						</button>
					</li>
					<li class="box-nav-smartphone2">
						<div class="language-selector">
    						<select id="language-select" class="language-select">
        						<option value="en">EN</option>
        						<option value="fr">FR</option>
        						<option value="es">ES</option>
    						</select>
						</div>
					</li>
					<li class="box-nav-smartphone3">
						<button class="button-center-items" style="color: #b3b3b3" id="logoutLink">
							<i class="fa-solid fa-right-from-bracket image-nav" style="margin-top: 5px; color: #b3b3b3"></i>
							<p style="font-size: 15px" data-translate-key="logout"></p>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	`;
}