import { loadContent } from "./utils.js";

export async function loadHomePage()
{
	let userInfo = await fetchUserInfo();

	let homeHTML = generateHomePageHTML(userInfo);

	loadContent(homeHTML, "home", true);
	document.getElementById("app").innerHTML = generateHomePageHTML(userInfo);
}

async function fetchUserInfo()
{
	try
	{
		const response = await fetch('https://localhost:8443/api/userinfo/', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			console.log('Username:', data.username);
			console.log('Email: ', data.email);
			return data;
		} else {
			console.error('Failed to fetch user info:', response.statusText);
			return null;
		}
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

function generateBodyHomePageHTML(userInfo)
{
	return `
		<div class="flex-container">
			<button class="flex-item box1">
				<h1>HELLO</h1>
				<h3>coucou</h3>
			</button>
			<button class="flex-item box2">2</button>
			<button class="flex-item box3">3</button>
			<button class="flex-item box4">4</button>
		</div>
	`;
}

function generateHomePageHTML(userInfo)
{
//	let nav = generateNavigator();
	let body = generateBodyHomePageHTML(userInfo);
	return (body);
}

