import { loadHomePage } from "../home.js";
import { loadPreparationSimpleMatchGamePage } from "../preparation-simple-match-game-page.js";


export function loadFinishPage(winOrLostStr)
{
	document.getElementById("app").innerHTML = finishPageHTML(winOrLostStr);

	const homeButtonFinishPage = document.getElementById("home-button-end-party");
	homeButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadHomePage();
	});

	const retryButtonFinishPage = document.getElementById("retry-button-end-party");
	retryButtonFinishPage.addEventListener('click', function (event) {
		event.preventDefault();
		loadPreparationSimpleMatchGamePage();
	});
}

function finishPageHTML(winOrLostStr)
{
	let finishStr = "Finish";
	let homeStr = "Home";
	let retryStr = "Retry";

	return `
		<div class="finish-page" id="finish-page">
			<h1>${finishStr}</h1>
			<h2>${winOrLostStr}</h2>
			<div class="button-finish-page">
				<button id="home-button-end-party" class="button-center-items home-button-end-party" style="color: white">
					<i class="fa-solid fa-house home-button-finish-page" style="color: white"></i>
					<p style="font-size: 20px">${homeStr}</p>
				</button>
				<button id="retry-button-end-party" class="button-center-items retry-button-end-party" style="color: white">
					<i class="fa-solid fa-rotate-right retry-button-finish-page" style="color: white"></i>
					<p style="font-size: 20px">${retryStr}</p>
				</button>
			</div>
		<div>
	`;
}