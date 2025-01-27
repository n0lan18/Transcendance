
import { addEventListenerAuthPage, loadAuthentificationPage } from "./auth.js";
import { generateAuthentificationHTML } from "./auth.js";
import { addEventListenerHomePage, loadHomePage } from "./home.js";
import { loadContent } from "./utils.js";
import { translation } from "./translate.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { addEventListenerEmailRegister } from "./register/email-register.js"
import { addEventListenerUsernameRegister, loadRegisterUsernamePage } from "./register/username-register.js"
import { addEventListenerPasswordRegister, loadRegisterPasswordPage } from "./register/password-register.js"
import { addEventListenerProfile } from "./profile.js"
import { addEventListenerStats, loadStatsPage } from "./stats.js";
import { addEventListenerContinueOrNewTournament, loadContinueOrNewTournamentPage } from "./continue-or-finish-page.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";
import { loadProfilePage } from "./profile.js";
import { loadRegisterEmailPage } from "./register/email-register.js";
import { addRoute, loadRoute } from "./router.js";
import { loadPreparationTournamentGamePage } from "./preparation-tournament-game-page.js";
import { loadPreparationSimpleMatchGamePage } from "./preparation-simple-match-game-page.js";
import { loadUsernamePlayersTournament } from "./username-players-tournament.js";



document.addEventListener('DOMContentLoaded', async () => 
    {
        const jwtToken = localStorage.getItem('jwt_token');
        console.log("JWT Token:", jwtToken);

        addRoute("/login", { loadFunction: loadAuthentificationPage });
        addRoute("/home", { loadFunction: loadHomePage });
        addRoute("/profile", { loadFunction: loadProfilePage });
        addRoute("/stats", { loadFunction: loadStatsPage });
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

        if (jwtToken)
            loadRoute(window.location.pathname);
        else
            loadRoute('/login');

/*        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
            {
                console.log("PAGE ROUUUUTEW")
                loadRoute(window.location.pathname);
            }
            } else {
                console.error("No state found in history");
            }
        });

        window.addEventListener('popstate', function(event) {
            if (event.state && event.state.page) {
                // Charger le contenu associé à la page
                if (this.window.location.pathname === "/login")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Authentification Page', "", "", addEventListenerAuthPage);
                else if (this.window.location.pathname === "/register-email")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, "Register Email", "", "", addEventListenerEmailRegister);
                else if (this.window.location.pathname === "/register-username")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, "Register Username", "", "", addEventListenerUsernameRegister);
                else if (this.window.location.pathname === "/register-password")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, "Register Password", "", "", addEventListenerPasswordRegister);
                else if (this.window.location.pathname === "/continue-or-new-tournament")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Continue Or New Tournament', translation, addNavigatorEventListeners, addEventListenerContinueOrNewTournament)
                else if (this.window.location.pathname === "/tournament-presentation")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Tournament Presentation', translation, addNavigatorEventListeners, loadTournamentPresentation)
                else if (this.window.location.pathname === "/preparation-solo-tournament")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Preparation Tournament', translation, addNavigatorEventListeners, addEventListenerPreparationTournament);
            }
        });
*/});
