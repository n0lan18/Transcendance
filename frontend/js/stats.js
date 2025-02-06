import { generateNavigator } from "./nav.js";
import { getStatsInfoAll, getStatsInfoAllById } from "./utils.js";
import { loadContent } from "./utils.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { translation } from "./translate.js";
import { loadHistoryGamePage } from "./historic-game-page.js";

export async function loadStatsPage(userStat)
{
	let userStatsInfoAll;
	if (userStat)
		userStatsInfoAll = await getStatsInfoAllById(userStat);
	else
		userStatsInfoAll = await getStatsInfoAll();

	let statsHTML = generateStatsPageHTML(userStatsInfoAll);	

	if (userStat)
		loadContent(document.getElementById('app'), statsHTML, "stats-friend", true, 'Stats Page Friend', translation, addNavigatorEventListeners, () => addEventListenerStats(userStatsInfoAll));
	else
		loadContent(document.getElementById('app'), statsHTML, "stats-perso", true, 'Stats Page Perso', translation, addNavigatorEventListeners, () => addEventListenerStats(userStatsInfoAll));
	document.getElementById("app").innerHTML = generateStatsPageHTML(userStatsInfoAll);

	translation();

	addNavigatorEventListeners()

	addEventListenerStats(userStatsInfoAll);
}

window.addEventListener('popstate', async function(event) {
	if (event.state && event.state.page) {
		if (this.window.location.pathname === "/stats-perso")
		{
			let userStatsInfoAll = await getStatsInfoAll();
			loadContent(this.document.getElementById("app"), event.state.page, '', false, "Stats Page Perso", translation, addNavigatorEventListeners,  () => addEventListenerStats(userStatsInfoAll));
		}
		if (this.window.location.pathname === "/stats-friend")
		{
			let userStatsInfoAll = await getStatsInfoAllById(this.window.idStat);
			loadContent(this.document.getElementById("app"), event.state.page, '', false, "Stats Page Perso", translation, addNavigatorEventListeners,  () => addEventListenerStats(userStatsInfoAll));
		}
	}
});

export function  addEventListenerStats(userStatsInfoAll)
{
	if (window.location.pathname === "/stats-friend")
		document.getElementById("btn-HistoricMatches").remove();
	
	let imageHero;
	let powerHero;

	if (userStatsInfoAll.heroInvisible > (userStatsInfoAll.heroDuplication && userStatsInfoAll.heroSuperstrength && userStatsInfoAll.heroTimelaps))
	{
		imageHero = "../images/super1.png";
		powerHero = "Invisible";
	}
	else if (userStatsInfoAll.heroDuplication > (userStatsInfoAll.heroInvisible && userStatsInfoAll.heroSuperstrength && userStatsInfoAll.heroTimelaps))
	{
		imageHero = "../images/super2.png";
		powerHero = "Duplication";		
	}
	else if (userStatsInfoAll.heroSuperstrength > (userStatsInfoAll.heroInvisible && userStatsInfoAll.heroDuplication && userStatsInfoAll.heroTimelaps))
	{
		imageHero = "../images/super3.png";
		powerHero = "Super strength";		
	}
	else if (userStatsInfoAll.heroTimelaps > (userStatsInfoAll.heroInvisible && userStatsInfoAll.heroDuplication && userStatsInfoAll.heroSuperstrength))
	{
		imageHero = "../images/super4.png";
		powerHero = "Time laps";		
	}
	else
	{
		imageHero = "../images/profile-logo-white.png";
		powerHero = "Nothing";
	}

	const imagePlayer = document.getElementById("superhero-image");
	imagePlayer.src = imageHero;
	const textPlayer = document.getElementById("superhero-power-text-player1");
	textPlayer.textContent = powerHero;

	let numberVictory = userStatsInfoAll.numberVictoryMatchTournament + userStatsInfoAll.numberVictorySimpleMatch;
	let numberDefeat =  (userStatsInfoAll.numberSimpleMatch + userStatsInfoAll.numberMatchTournament)- numberVictory;

	const ctx1 = document.getElementById('myDonutChart1').getContext('2d');
	let myDonutChart1;
	if (numberVictory == 0 && numberDefeat == 0)
		myDonutChart1 = addGraphics(1, 0, 'Victory', 'Defeat', ctx1);
	else
		myDonutChart1 = addGraphics(numberVictory, numberDefeat, 'Victory', 'Defeat', ctx1);

	const ctx2 = document.getElementById('myDonutChart2').getContext('2d');
	let myDonutChart2;
	if (userStatsInfoAll.numberGoalsWin == 0 && userStatsInfoAll.numberGoalLose == 0)
		myDonutChart2 = addGraphics(1, 0, 'G.S', 'G.C', ctx2);
	else
		myDonutChart2 = addGraphics(userStatsInfoAll.numberGoalsWin, userStatsInfoAll.numberGoalLose, 'G.S', 'G.C', ctx2);

	window.addEventListener('resize', () => {
		if (window.innerWidth <= 900)
		{
			myDonutChart1.resize();
			myDonutChart2.resize();
		}
	});

	addLastMatchesAndResultats(userStatsInfoAll);

	const buttonSeeHistoricMatchPage = document.getElementById("send-historic-page-button");
	if (buttonSeeHistoricMatchPage)
	{
		buttonSeeHistoricMatchPage.addEventListener('click', (event) => {
			event.preventDefault();
			loadHistoryGamePage();
		});
	}
}

function addGraphics(data1, data2, label1, label2, ctx)
{
	let myDonutChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: [`${label1}`, `${label2}`],
			datasets: [{
				data: [data1, data2],
				backgroundColor: [
					'rgba(25, 130, 196, 0.8)',
					'rgba(255, 202, 58, 0.8)',
				],
				borderColor: [
					'rgba(25, 130, 196, 1)',
					'rgba(255, 202, 58, 1)',
				],
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'none',
				},
				datalabels: {
					color: '#fff', // Couleur du texte
					formatter: (value, context) => {
						return context.chart.data.labels[context.dataIndex]; // Utilise les labels comme texte
					},
					font: {
						weight: 'bold',
						size: 10
					}
				}
			}
		},
	});
	return myDonutChart;
}

function addLastMatchesAndResultats(userStatsInfoAll)
{
	const lastMatchesContainer = document.getElementById("resultsLastMatches");
	let content = "";
	for (let i = 0; i < userStatsInfoAll.scores.length; i++)
	{
		let backgroundColor = '';
		if (userStatsInfoAll.resultats[i] === "D") {
            backgroundColor = '#e03f27';
        }
        // Si le score est "V" (Victoire), fond vert
        else if (userStatsInfoAll.resultats[i] === "V") {
            backgroundColor = '#8ac926';
        }

		content += `
			<div class="scoresAndResultats">
				<h3>${userStatsInfoAll.scores[i]}</h3>
				<h3 class="resultatsStatsMatches" style="background-color: ${backgroundColor};">${userStatsInfoAll.resultats[i]}</h3>
				<p class="dates-stats-match">${userStatsInfoAll.dates[i]}</p>
			</div>
		`
	}
	if (content == "")
	{
		content += `
			<div class="scoresAndResultats">
				<h3>No stats</h3>
			</div>
		`
	}
	lastMatchesContainer.innerHTML = content;
}

function generateBodyStatsPageHTML(userStatsInfoAll)
{
	const numberVictory = userStatsInfoAll.numberVictoryMatchTournament + userStatsInfoAll.numberVictorySimpleMatch;
	const numberDefeat = (userStatsInfoAll.numberMatchTournament + userStatsInfoAll.numberSimpleMatch) - numberVictory;
	const ratioGame = (numberVictory / numberDefeat).toFixed(2)
	const ratioGoals = (userStatsInfoAll.numberGoalsWin / userStatsInfoAll.numberGoalLose).toFixed(2)
	const totalMatch = userStatsInfoAll.numberMatchTournament + userStatsInfoAll.numberSimpleMatch
	let partTournamentStr;
	switch (userStatsInfoAll.bestResultTournament)
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
		<div class="message-change-orientation">
			<h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
			<i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
		</div>
		<div class="statsContainer" id="statsContainer">
			<h1 data-translate-key="stats"></h1>
			<div class="bestHeroAndTotalMatches">
				<div class="bestHero" id="bestHero">
					<img id="superhero-image" class="superhero-image" src="" alt="Photo Album" style="border-radius: 10px;"></img>
					<div class="superhero-power-text">
						<i class="fa-brands fa-superpowers" style="text-align: center;"></i>
						<p id="superhero-power-text-player1"></p>
					</div>
				</div>
				<div class="totalMatches" id="totalMatches">
					<h2 data-translate-key="totalMatches"></h2>
					<h2>${totalMatch}</h2>
				</div>
				<div class="bestScoreTournament" id="bestScoreTournament">
					<h2 data-translate-key="bestScoreTournament"></h2>
					<h2>${partTournamentStr}</h2>
				</div>
			</div>
			<div class="lastMatches" id="lastMatches">
				<h2 data-translate-key="lastMatches"></h2>
				<div class="resultsLastMatches" id="resultsLastMatches">
				</div>
			</div>
			<div class="btn-HistoricMatches" id="btn-HistoricMatches">
				<input id="send-historic-page-button" data-translate-key="historic-game" value="" class="btn btn-primary btn-block mb-4 send-historic-game-button" style="width: 100%;">
			</div>
			<div class="graphics" id="graphics">
				<div class="victoryDefeat" id="victoryDefeat">
					<h2 data-translate-key="victoryDefeat"></h2>
				    <div class="graphicDonut" id="graphicDonut">
        				<canvas id="myDonutChart1"></canvas>
    				</div>
					<h3 data-translate-key="ratio"></h3>
					<h3>${ratioGame}</h3>
				</div>
				<div class="victoryDefeat" id="victoryDefeat">
					<h2 data-translate-key="goalScoresGoalConceded"></h2>
				    <div class="graphicDonut" id="graphicDonut">
        				<canvas id="myDonutChart2"></canvas>
    				</div>
					<h3 data-translate-key="ratio"></h3>
					<h3>${ratioGoals}</h3>
				</div>
			</div>
		</div>
	`;
}

export function generateStatsPageHTML(userStatsInfoAll)
{
	let nav = generateNavigator();
	let body = generateBodyStatsPageHTML(userStatsInfoAll);

	return (nav + body);
}