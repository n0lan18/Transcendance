import { addNavigatorEventListeners } from "./eventListener/navigator";
import { translation } from "./translate";

export async function loadHistoryGamePage()
{
    let historicGameHTML = generateHistoricGamePage(userStatsInfoAll);	

    loadContent(document.getElementById('app'), historicGameHTML, "history-game", true, 'History Game Page', translation, addNavigatorEventListeners, addEventListenerHistoricGame);
   
    document.getElementById("app").innerHTML = generateHistoricGamePage(userStatsInfoAll);

    translation();

    addNavigatorEventListeners()

    addEventListenerHistoricGame()
}

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
			<div class="friends-line" id="friends-line${index + 1}">
                <div class="indexMatch" id="indexMatch">
                    <h1>${index + 1}</h1>
                </div>
				<div class="img-username-user" id="img-username-user">
					<img id="img-friends${index + 1}" class="superhero-image" src="${imagePlayer1}" alt="Profile image" style="width: 35px; height: 35px; border-radius: 10px;">
					<h2>${username1}</h2>
                    <h2>${scores}</h2>
                    <h2>${username2}</h2>
                    <img id="img-friends${index + 1}" class="superhero-image" src="${imagePlayer2}" alt="Profile image" style="width: 35px; height: 35px; border-radius: 10px;">
				</div>	
				<div class="page-match-button">
                	<input id="game-page-button${index + 1}" value="Match" class="btn btn-primary btn-block mb-4 send-preparation-game-button" style="width: 30%;">
            	</div>
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
            friendsLine.className = "friends-line";
            friendsLine.id = `friends-line${index + 1}`;
            let matchListHTML = matchesTemplate(i, historyMatches[i].imagePlayer1, historyMatches[i].username1, historyMatches[i].scores, historyMatches[i].username2, historyMatches[i].imagePlayer2); 
            friendsLine.innerHTML = matchListHTML;
            listHistory.appendChild(friendsLine);
            const buttonPageMatch = document.getElementById(`game-page-button${i + 1}`);
            if (buttonPageMatch)
            {
                console.log("PageMAtch");
                //loadPageMatch
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

