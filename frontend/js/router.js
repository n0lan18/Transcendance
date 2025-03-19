import { loadAuthentificationPage } from "./auth.js";
import { loadContinueOrNewTournamentPage } from "./continue-or-finish-page.js";
import { loadHomePage } from "./home.js";
import { loadPreparationSimpleMatchGamePage } from "./preparation-simple-match-game-page.js";
import { loadPreparationTournamentGamePage } from "./preparation-tournament-game-page.js";
import { loadProfilePage } from "./profile.js";
import { loadRegisterEmailPage } from "./register/email-register.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";
import { loadUsernamePlayersTournament } from "./username-players-tournament.js";
import { loadOnlineGamePage } from "./online.js";
import { loadContent } from "./utils.js";


const routes = {
	"/": loadHomePage,
    "/login": loadAuthentificationPage,
    "/home": loadHomePage,
    "/profile": loadProfilePage,
	"/continue-or-new-tournament": loadContinueOrNewTournamentPage,
	"/tournament-presentation": loadTournamentPresentation,
	"/preparation-solo-tournament": loadPreparationTournamentGamePage,
	"/preparation-username-tournament": 
	() => {
		const courtColor = "0xCF5A30"; // Exemple de valeur dynamique
		const sizeTournament = 32; // Exemple de valeur dynamique
		const superPower = "isSuperPower"; // Exemple de valeur dynamique
		loadUsernamePlayersTournament(courtColor, sizeTournament, superPower);
	},
	"/preparation-game": loadPreparationSimpleMatchGamePage,
    "/register-email": loadRegisterEmailPage,
	"/preparation-online-game": loadOnlineGamePage,
  };

// Fonction pour ajouter de nouvelles routes
export function addRoute(path, routeConfig) {
	console.log("Ajout de la route:", path);
	
	// Ajouter la route dans l'objet 'routes' si elle n'existe pas déjà
	if (!routes[path]) {
	  routes[path] = routeConfig.loadFunction;
	}
}

document.addEventListener("DOMContentLoaded", () => {
    const login42Button = document.getElementById("login-42-button");
    if (login42Button) {
        login42Button.addEventListener("click", () => {
            window.location.href = "/api/accounts/42/login/";
        });
    }
})


// Fonction unique pour charger les routes
export function loadRoute(pathname) {
	const route = routes[pathname];  // Chercher la route dans l'objet 'routes'
	if (route) {
		route();  // Appeler la fonction de la route correspondante
	} else {
		console.error(`Unknown route: ${pathname}`);
		const jwtToken = localStorage.getItem('jwt_token');
		if (jwtToken)
			loadHomePage();
		else
			loadAuthentificationPage();  // Charger une page par défaut en cas d'erreur
	}
  }

export { routes };