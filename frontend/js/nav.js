export function generateNavigator(userInfo)
{
	let username;

	if (userInfo.username === "")
		username = "Gest";
	else
		username = userInfo;
	let logout = "Logout";
	return `
		<div class="container-fluid">
			<nav class="navbar navbar-expand-md navbar-dark bg-dark">
				<div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
					<ul class="navbar-nav ml-auto">
						<li class="nav-item">
							<p class="nav-link nav-username">${username}</p>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="#" id="sub-link-nav" >${logout}</a>
						</li>
					</ul>
				</div>
        	</nav>
		</div>
	`;
}