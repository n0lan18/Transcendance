
import { addEventListenerAuthPage, loadAuthentificationPage } from "./auth.js";
import { generateAuthentificationHTML } from "./auth.js";
import { addEventListenerHomePage, generateHomePageHTML, loadHomePage } from "./home.js";
import { loadContent } from "./utils.js";
import { getUserInfo } from "./utils.js";
import { translation } from "./translate.js";
import { addNavigatorEventListeners } from "./eventListener/navigator.js";
import { addEventListenerEmailRegister } from "./register/email-register.js"
import { addEventListenerUsernameRegister } from "./register/username-register.js"
import { addEventListenerPasswordRegister } from "./register/password-register.js"
import { addEventListenerProfile } from "./profile.js"
import { addEventListenerStats } from "./stats.js";
import { addEventListenerContinueOrNewTournament } from "./continue-or-finish-page.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";
import { addEventListenerPreparationTournament } from "./preparation-tournament-game-page.js";


document.addEventListener('DOMContentLoaded', async () => 
    {
        const jwtToken = localStorage.getItem('jwt_token');
        console.log("JWT Token:", jwtToken);

        if (jwtToken)
        {
            let userInfo = await getUserInfo();
        
            let homeHTML = generateHomePageHTML(userInfo);
            loadContent(document.getElementById("app"), homeHTML, "home", true, 'Home Page', translation, addNavigatorEventListeners, addEventListenerHomePage);
            loadHomePage();
        }
        else
        {
            let authHTML = generateAuthentificationHTML();
            let jwt_token = localStorage.getItem('jwt_token');
            loadContent(document.getElementById("app"), authHTML, "login", true, 'Authentification Page', "", "", addEventListenerAuthPage);
            loadAuthentificationPage();
        }

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
                else if (this.window.location.pathname === "/home")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Home Page', translation, addNavigatorEventListeners, addEventListenerHomePage);
                else if (this.window.location.pathname === "/profile")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, "Profile Page", translation, addNavigatorEventListeners, addEventListenerProfile)
                else if (this.window.location.pathname === "/stats")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, "Stats Page", translation, addNavigatorEventListeners, addEventListenerStats);
                else if (this.window.location.pathname === "/continue-or-new-tournament")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Continue Or New Tournament', translation, addNavigatorEventListeners, addEventListenerContinueOrNewTournament)
                else if (this.window.location.pathname === "/tournament-presentation")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Tournament Presentation', translation, addNavigatorEventListeners, loadTournamentPresentation)
                else if (this.window.location.pathname === "/preparation-solo-tournament")
                    loadContent(this.document.getElementById("app"), event.state.page, '', false, 'Preparation Tournament', translation, addNavigatorEventListeners, addEventListenerPreparationTournament);
            }
        });
});