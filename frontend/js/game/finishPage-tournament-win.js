import { loadPresentationSoloPlayerPage } from "../presentation-match-solo-tournament.js";


export function loadFinishPageTournamentWin(username1, courtColor, colorPlayer1, heroPowerPlayer1, numberPlayers)
{
	document.getElementById("app").innerHTML = finishPageHTML(numberPlayers);

	const homeButtonFinishPage = document.getElementById("continue-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadPresentationSoloPlayerPage(username1, courtColor, colorPlayer1, heroPowerPlayer1, numberPlayers)
	});
}

function finishPageHTML(numberPlayers)
{
	let homeStr = "Continue";
	let winStr = "Congratulations! You've won!";
	let roadToStr = "Road to 1/" + numberPlayers / 2 + " final";
	if (numberPlayers == 4)
		roadToStr = "Road to Semi final";
	else if (numberPlayers == 2)
		roadToStr = "Road to Final";

	return `
		<div class="finish-page" id="finish-page">
			<h1>${winStr}</h1>
			<h2>${roadToStr}</h2>
			<div class="button-finish-page">
				<button id="continue-button-end-party" class="button-center-items home-button-end-party" style="color: white">
					<i class="fa-solid fa-arrow-right-to-bracket home-button-finish-page" style="color: white"></i>
					<p style="font-size: 20px">${homeStr}</p>
				</button>
			</div>
		<div>
	`;
}