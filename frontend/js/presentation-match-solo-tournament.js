import { loadContent } from "./utils.js";
import { loadSoloPlayerPage } from "./solo-player.js";
import { translation } from "./translate.js";

export async function loadPresentationSoloPlayerPage(username1, courtColor, colorPlayer1, heroPowerPlayer1, numberPlayers, sizePlayers, superPower)
{
	let username2 = "et6485Q";
	let colorPlayer2 = "#3BB323";
	let heroPowerPlayer2 = "Super strength";

	const stringsHeroPowerPlayer2 = ["Invisible", "Duplication", "Super strength", "Time laps"];
	heroPowerPlayer2 = stringsHeroPowerPlayer2[Math.floor(Math.random() * stringsHeroPowerPlayer2.length)];

	const stringsColorPlayer2 = ["#E23F22", "#3BB323", "#32689A"];
	colorPlayer2 = stringsColorPlayer2[Math.floor(Math.random() * stringsColorPlayer2.length)];

	const stringsUsernamePlayer2 = ["et6485Q", "ava782e", "AR8725e", "QOWDJDdd44", "HELdofj7"];
	username2 = stringsUsernamePlayer2[Math.floor(Math.random() * stringsUsernamePlayer2.length)];

	let imageHeroPlayer1;
	switch (heroPowerPlayer1)
	{
		case "Invisible" :
			imageHeroPlayer1 = "../images/super1.png";
			break ;
		case "Duplication" :
			imageHeroPlayer1 = "../images/super2.png";
			break ;
		case "Super strength" :
			imageHeroPlayer1 = "../images/super3.png";
			break ;
		case "Time laps" :
			imageHeroPlayer1 = "../images/super4.png";
			break ;
	}

	let imageHeroPlayer2;
	switch (heroPowerPlayer2)
	{
		case "Invisible" :
			imageHeroPlayer2 = "../images/super1.png";
			break ;
		case "Duplication" :
			imageHeroPlayer2 = "../images/super2.png";
			break ;
		case "Super strength" :
			imageHeroPlayer2 = "../images/super3.png";
			break ;
		case "Time laps" :
			imageHeroPlayer2 = "../images/super4.png";
			break ;
	}

	const bodyPresentation = generateBodyPresentationPageHTML(username1, username2, numberPlayers, heroPowerPlayer1, heroPowerPlayer2)

	loadContent(bodyPresentation, "presentation-solo-tournament", true);

	document.getElementById("app").innerHTML = bodyPresentation;
	translation();

	const imagePlayer1 = document.getElementById("superhero-image");
	imagePlayer1.src = imageHeroPlayer1;

	const imagePlayer2 = document.getElementById("superhero-image2");
	imagePlayer2.src = imageHeroPlayer2;

	if (superPower == "isNotSuperPower")
	{
		let superHeroImage1 = document.getElementById("superhero-image");
		let superHeroImage2 = document.getElementById("superhero-image2");
		let superHeroPowerText1 = document.getElementById("superhero-power-text");
		let superHeroPowerText2 = document.getElementById("superhero-power-text2");
		superHeroImage1.style.display = "none";
		superHeroImage2.style.display = "none";
		superHeroPowerText1.style.display = "none";
		superHeroPowerText2.style.display = "none";
	}


	const buttonStart = document.getElementById("send-preparation-game-button");
	buttonStart.addEventListener('click', function (event) {
		event.preventDefault();
		loadSoloPlayerPage(username1, username2, courtColor, colorPlayer1, colorPlayer2, heroPowerPlayer1, heroPowerPlayer2, "tournament", numberPlayers / 2, sizePlayers, superPower);
	});
}

function generateBodyPresentationPageHTML(username, username2, numberPlayers, heroPowerPlayer1, heroPowerPlayer2)
{
	let partTournamentStr;

	switch (numberPlayers)
	{
		case 64 :
			partTournamentStr = "1/32 final";
			break ;
		case 32 :
			partTournamentStr = "1/16 final";
			break ;
		case 16 :
			partTournamentStr = "1/8 final";
			break ;
		case 8 :
			partTournamentStr = "1/4 final";
			break ;
		case 4 :
			partTournamentStr = "Semi Final";
			break ;
		case 2 :
			partTournamentStr = "Final";
			break ;
	}
	return `
	<div class="presentation-tournament-container">
		<h1>${partTournamentStr}</h1>
		<div class="players-presentation">
			<div class="presentation-solo-player1">
				<h2>${username}</h2>
				<img id="superhero-image" class="superhero-image" src="" alt="Photo Album" style="border-radius: 10px;"></img>
				<div class="superhero-power-text" id="superhero-power-text">
					<i class="fa-brands fa-superpowers" style="text-align: center;"></i>
					<p id="superhero-power-text-player1">${heroPowerPlayer1}</p>
				</div>
			</div>
			<div class="vs-container">
				<h1>VS</h1>
			</div>
			<div class="presentation-solo-player2">
				<h2>${username2}</h2>
				<img id="superhero-image2" class="superhero-image" src="" alt="Photo Album" style="border-radius: 10px;"></img>
				<div class="superhero-power-text" id="superhero-power-text2">
					<i class="fa-brands fa-superpowers" style="font-size: 15px; text-align: center;"></i>
					<p id="superhero-power-text-player1">${heroPowerPlayer2}</p>
				</div>
			</div>
		</div>
	<input id="send-preparation-game-button" data-translate-key="play" value="" class="btn btn-success btn-block mb-4 send-preparation-game-button" style="width: 30%;">	
	</div>
	`
}