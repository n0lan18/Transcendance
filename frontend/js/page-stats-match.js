import { translation } from "./translate.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { getHistoryMatches, loadContent } from "./utils.js";
import { generateNavigator } from "./nav.js";

export async function loadPageMatch()
{
    let statsMatchPageHTML = await generateStatsMatchPage();

    loadContent(document.getElementById('app'), statsMatchPageHTML, "page-stats-match", true, 'Page Stats Match', translation, addNavigatorEventListeners, "");
   
    document.getElementById("app").innerHTML = statsMatchPageHTML;

    translation();

    addNavigatorEventListeners();
}

window.addEventListener('popstate', async function(event) {
    if (event.state && event.state.page) {
        if (this.window.location.pathname === "/page-stats-match")
            loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Page Stats Match', translation, addNavigatorEventListeners, "");
    }
});

async function generateStatsMatchPageHTML() {
    try {
        const matchInfo = await getHistoryMatches();

        if (!matchInfo || !matchInfo[window.idMatchStat]) {
            console.error("Match information not found or invalid.");
            return `<div>Error: Match information not available.</div>`;
        }

        const matchData = matchInfo[window.idMatchStat];

        const heroImages = {
            "Invisible": "../images/super1.png",
            "Duplication": "../images/super2.png",
            "Super strength": "../images/super3.png",
            "Time laps": "../images/super4.png"
        };

        const imagePlayer1 = heroImages[matchData.heroPlayer1] || "../images/default.png";
        const imagePlayer2 = heroImages[matchData.heroPlayer2] || "../images/default.png";

        let totalSecondes = matchData.dureeMatch / 1000
        let minute = Math.floor(totalSecondes / 60);
        let seconds = (totalSecondes % 60).toFixed(0);

        return `
        <div class="message-change-orientation">
            <h1 style="font-size: 25px; text-align: center;" data-translate-key="messageChangeOrientation"></h1>
            <i class="fa-solid fa-rotate" style="font-size: 50px; text-align: center;"></i>
        </div>
        <div class="stats-match-page-container">
            <h1 data-translate-key="stat-match"></h1>
            <div class="list-history-game-container" id="list-history-game-container">
                <div class="recap-match-stats-page">
                    <div class="recap-match" id="recap-match">
                        <div class="recap-match-user1">
                            <img id="img-friends1" class="img-friends1" src="${imagePlayer1}" alt="Profile image">
                            <h2 style="margin-left: 5px;">${matchData.username1 || "Unknown Player 1"}</h2>
                        </div>
                        <h2 class="recap-match-scores">${matchData.scores || "0-0"}</h2>
                        <div class="recap-match-user2">
                            <h2 style="margin-right: 5px;">${matchData.username2 || "Unknown Player 2"}</h2>
                            <img id="img-friends2" class="img-friends2" src="${imagePlayer2}" alt="Profile image"; >
                        </div>
                    </div>
                    <h3 class="date-match-stats">${matchData.dates || "1/1/2025"}</h3>
                </div>
                <div class="statspart-match-page">
                    <div class="statspart">
                        <h2 data-translate-key="winner"></h2>
                        <h3>${matchData.vainqueur || "Player1"}</h3>
                    </div>
                    <div class="statspart">
                        <h2 data-translate-key="duration-match"></h2>
                        <h3>${minute + "min " + seconds + "sec" || "0min 0sec"}</h3>
                    </div>
                    <div class="statspart">
                        <h2 data-translate-key="longest-rally"></h2>
                        <h3>${matchData.echangeLong || "0"}</h3>
                    </div>
                    <div class="statspart">
                        <h2 data-translate-key="number-gamebreaker"></h2>
                        <h3>${matchData.numberGameBreaker || "0"}</h3>
                    </div>
                </div>
            </div>
        </div>
        `;
    } catch (error) {
        console.error("Error generating stats match page HTML:", error);
        return `<div>Error: Unable to generate stats match page.</div>`;
    }
}

async function generateStatsMatchPage()
{
    let nav = generateNavigator();
    let body = await generateStatsMatchPageHTML();

    return (nav + body);
}
