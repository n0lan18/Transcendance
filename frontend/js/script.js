
import { loadAuthentificationPage } from "./auth.js";
import { loadHomePage } from "./home.js";
import { loadStatsPage } from "./stats.js";
import { loadContinueOrNewTournamentPage } from "./continue-or-finish-page.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";
import { loadProfilePage } from "./profile.js";
import { loadRegisterEmailPage } from "./register/email-register.js";
import { addRoute, loadRoute } from "./router.js";
import { loadPreparationTournamentGamePage } from "./preparation-tournament-game-page.js";
import { loadPreparationSimpleMatchGamePage } from "./preparation-simple-match-game-page.js";
import { loadUsernamePlayersTournament } from "./username-players-tournament.js";
import { loadFinishPageTournament } from "./game/finishPage-tournament.js";
import { loadFinishPageTournamentWin } from "./game/finishPage-tournament-win.js";
import { loadFriendsPage } from "./friends.js";

document.addEventListener('DOMContentLoaded', async () => 
    {
        const jwtToken = localStorage.getItem('jwt_token');
        console.log("JWT Token:", jwtToken);

        addRoute("/login", { loadFunction: loadAuthentificationPage });
        addRoute("/home", { loadFunction: loadHomePage });
        addRoute("/profile", { loadFunction: loadProfilePage });
        addRoute("/stats-perso", { loadFunction: loadStatsPage });
        addRoute("/continue-or-new-tournament", { loadFunction: loadContinueOrNewTournamentPage });
        addRoute("/tournament-presentation", { loadFunction: loadTournamentPresentation});
        addRoute("/preparation-solo-tournament", { loadFunction: loadPreparationTournamentGamePage });
        addRoute('/preparation-username-tournament', { loadFunction: loadUsernamePlayersTournament });
        addRoute('/preparation-simple-game', { 
            loadFunction: () => {
                const typeOfGame = "multiplayer";
                const modeGame = "multiPlayerTwo";
                loadPreparationSimpleMatchGamePage(typeOfGame, modeGame);
            }
        });        
        addRoute('/preparation-double-game', { 
            loadFunction: () => {
                const typeOfGame = "multiplayer";
                const modeGame = "multiPlayerFour";
                loadPreparationSimpleMatchGamePage(typeOfGame, modeGame);
            }
        });
        addRoute("/register-email", { loadFunction: loadRegisterEmailPage });
        addRoute('/finish-page-tournament-win', { loadFunction: loadFinishPageTournament});
        addRoute('/finish-page-tournament', { loadFunction: loadFinishPageTournamentWin});
        addRoute('/friends', { loadFunction: loadFriendsPage });


        if (jwtToken)
            loadRoute(window.location.pathname);
        else
            loadRoute('/login');
});
