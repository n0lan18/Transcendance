import { generateAuthentificationHTML } from "./auth.js";
import { generateRegisterHTML } from "./register.js";

export function navigate(page)
{
	const app = document.getElementById("app");
	switch (page)
	{
		case 'register':
			generateRegisterHTML(app);
			break ;
		case 'login':
			generateAuthentificationHTML(app);
			break ;
		default:
			app.innerHTML = `<h1>404 - Page Not Found</h1>`;
			break ;
	}
}

export function setupNavigation()
{
	document.addEventListener('click', (event) => {
		if (event.target.tagName === 'A' && event.target.dataset.page)
		{
			event.preventDefault();
			const page = event.target.dataset.page;
			navigate(event.state.page);
			history.pushState({page}, "", `#{page}`);
		}
	});

	window.addEventListener('popstate', (event) => {
		if (event.state && event.state.page) {
			navigate(event.state.page);
		} else {
			navigate('login');
		}
	});
}