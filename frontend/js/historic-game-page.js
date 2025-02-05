import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { generateNavigator } from "./nav.js";
import { loadPageMatch } from "./page-stats-match.js";
import { translation } from "./translate.js";
import { getHistoryMatches, loadContent } from "./utils.js";

window.idMatchStat = 0;

export async function loadHistoryGamePage()
{
    let historicGameHTML = generateHistoricGamePage();	

    loadContent(document.getElementById('app'), historicGameHTML, "history-game", true, 'History Game Page', translation, addNavigatorEventListeners, addEventListenerHistoricGame);
   
    document.getElementById("app").innerHTML = generateHistoricGamePage();

    translation();

    addNavigatorEventListeners()
}

window.addEventListener('popstate', async function(event) {
    if (event.state && event.state.page) {
        if (this.window.location.pathname === "/history-game")
            loadContent(this.document.getElementById("app"), event.state.page, '', false, 'History Game Page', translation, addNavigatorEventListeners, addEventListenerHistoricGame);
    }
});

async function addEventListenerHistoricGame()
{
    const matchesTemplate = (index, superPower1, username1, scores, username2, superPower2) => {
        let imagePlayer1;
        switch (superPower1)
        {
            case "Invisible" :
                imagePlayer1 = "../images/super1.png";
                break ;
            case "Duplication" :
                imagePlayer1 = "../images/super2.png";
                break ;
            case "Super strength" :
                imagePlayer1 = "../images/super3.png";
                break ;
            case "Time laps" :
                imagePlayer1 = "../images/super4.png";
                break ;
        }
    
        let imagePlayer2;
        switch (superPower2)
        {
            case "Invisible" :
                imagePlayer2 = "../images/super1.png";
                break ;
            case "Duplication" :
                imagePlayer2 = "../images/super2.png";
                break ;
            case "Super strength" :
                imagePlayer2 = "../images/super3.png";
                break ;
            case "Time laps" :
                imagePlayer2 = "../images/super4.png";
                break ;
        }

		return `
                <div class="indexMatch" id="indexMatch">
                    <h1>${index + 1}</h1>
                </div>
				<div class="recap-match" id="recap-match${index + 1}">
                    <div class="recap-match-user1">
					    <img id="img-friends${index + 1}" class="superhero-image" src="${imagePlayer1}" alt="Profile image" style="width: 35px; height: 35px; border-radius: 10px;">
					    <h2 style="margin-left: 5px;">${username1}</h2>
                    </div>
                    <h2 class="recap-match-scores">${scores}</h2>
                    <div class="recap-match-user2">
                        <h2 style="margin-right: 5px;">${username2}</h2>
                        <img id="img-friends${index + 1}" class="superhero-image" src="${imagePlayer2}" alt="Profile image" style="width: 35px; height: 35px; border-radius: 10px;">
                    </div>
                </div>	
				<div class="page-match-button">
                	<input id="game-page-button${index + 1}" value="Match" class="btn btn-primary btn-block mb-4 send-match-history-button" style="width: 100%;">
            	</div>
		`;
	};

    const historyMatches = await getHistoryMatches();
    for (let i = 0; i < historyMatches.length; i++)
    {
        const listHistory = document.getElementById("list-history-game-container");
        if (listHistory)
        {
            const friendsLine = document.createElement("div");
            friendsLine.className = "match-line";
            friendsLine.id = `match-line${i + 1}`;
            let matchListHTML = matchesTemplate(i, historyMatches[i].heroPlayer1, historyMatches[i].username1, historyMatches[i].scores, historyMatches[i].username2, historyMatches[i].heroPlayer2); 
            friendsLine.innerHTML = matchListHTML;
            listHistory.appendChild(friendsLine);
            const buttonPageMatch = document.getElementById(`game-page-button${i + 1}`);
            if (buttonPageMatch)
            {
                buttonPageMatch.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.idMatchStat = i;
                    loadPageMatch()
                });
            }
        }
    }
}

function generateHistoricGamePageHTML()
{
    return `
    <div class="message-change-orientation">
        <h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
        <i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
    </div>
    <div class="historic-game-container">
        <h1 data-translate-key="history-game-title"></h1>
        <div class="list-history-game-container" id="list-history-game-container"></div>
    </div>
`
}

function generateHistoricGamePage()
{
    let nav = generateNavigator();
    let body = generateHistoricGamePageHTML();

    return (nav + body);
}

