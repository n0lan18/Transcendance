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

/*
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('itemForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
        };

        try {
            const response = await fetch('https://localhost:8443/api/items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }

        const response = await fetch('https://localhost:8443/api/items/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
    });
});
*/