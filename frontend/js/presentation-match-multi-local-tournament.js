import { getMatchInfo, getTournamentInfo, loadContent } from "./utils.js";
import { loadSoloPlayerPage } from "./solo-player.js";
import { translation } from "./translate.js";


export async function loadPresentationMultiLocalPlayerPage()
{
	const dataTournament = await getTournamentInfo();
	const matchInfo = await getMatchInfo();
	const bodyPresentationHTML = generateBodyPresentationPageHTML(matchInfo.username1, matchInfo.username2, dataTournament.sizeTournament, matchInfo.heroPowerPlayer1, matchInfo.heroPowerPlayer2)

	loadContent(document.getElementById("app"), bodyPresentationHTML , "tournament-match-presentation", true, 'Tournament Match Presentation Page', translation, "", addEventListenerPresentationSoloTournament);

	document.getElementById("app").innerHTML = bodyPresentationHTML;
	translation();
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/tournament-match-presentation")
			loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Tournament Match Presentation Page', translation, "", addEventListenerPresentationSoloTournament);
	}
});

async function addEventListenerPresentationSoloTournament()
{
	const matchInfo = await getMatchInfo();
	let imageHeroPlayer1;
	switch (matchInfo.heroPowerPlayer1)
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
	switch (matchInfo.heroPowerPlayer2)
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

	const imagePlayer1 = document.getElementById("superhero-image");
	imagePlayer1.src = imageHeroPlayer1;

	const imagePlayer2 = document.getElementById("superhero-image2");
	imagePlayer2.src = imageHeroPlayer2;

	if (matchInfo.superPower == "isNotSuperPower")
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
	buttonStart.addEventListener('click', async function (event) {
		event.preventDefault();
		loadSoloPlayerPage("game-page-tournament", "Game Page Tournament");
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