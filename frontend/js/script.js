import { loadAuthentificationPage } from "./auth.js";
import { generateAuthentificationHTML } from "./auth.js";
import { generateHomePageHTML, loadHomePage } from "./home.js";
import { loadContent } from "./utils.js";
import { fetchUserInfo } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => 
    {
        const jwtToken = localStorage.getItem('jwt_token');
        console.log("JWT Token:", jwtToken);

        if (jwtToken)
        {
            let userInfo = await fetchUserInfo();
            console.log(userInfo);
        
            let homeHTML = generateHomePageHTML(userInfo);
            loadContent(homeHTML, "home", true);
            loadHomePage();
        }
        else
        {
            let authHTML = generateAuthentificationHTML();
            let jwt_token = localStorage.getItem('jwt_token');
	        if (jwt_token)
		        console.log("AAAA");
	        else
		        console.log("BBBBssss");
            loadContent(authHTML, "login", true);
            loadAuthentificationPage();
        }
});