export function generateNavigator()
{
	let game = "Game";
	let about = "About Us";
	let test = "Test";
	let login = "Login";
	let signin = "Sign In";
	let title = "Transcendance";
	return `
		<div class="container-fluid">
			<nav class="navbar navbar-expand-md navbar-dark bg-dark">
				<div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
					<ul class="navbar-nav mr-auto">
						<li class="nav-item">
							<a class="nav-link" href="#" id="game-link" >${game}</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="#" id="about-link">${about}</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="#" id="test-link">${test}</a>
						</li>
					</ul>
				</div>
				<div class="mx-auto order-0">
					<a class="navbar-brand mx-auto" id="home-link" href="#">${title}</a>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
						<span class="navbar-toggler-icon"></span>
					</button>
				</div>
				<div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
					<ul class="navbar-nav ml-auto">
						<li class="nav-item">
							<a class="nav-link" href="#" id="auth-link" >${login}</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="#" id="sub-link-nav" >${signin}</a>
						</li>
					</ul>
				</div>
        	</nav>
		</div>
	`;
}