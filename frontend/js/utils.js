import { loadAuthentificationPage } from "./auth.js";

export function loadContent(page, url, addToHistory) {
	$('#app').html(page);
	if (addToHistory) {
		history.pushState({ page: page }, '', `?page=${url}`);
	}
}

export async function fetchUserInfo()
{
	try
	{
		const response = await fetch('https://localhost:8443/api/userinfo/', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			console.log('Username:', data.username);
			return data;
		}
		else if (response.status === 401)
		{
			console.error('Unauthorized: Invalid or expired token');
			localStorage.removeItem('jwt_token');
			loadAuthentificationPage();
			return null;
		}
		else
		{
			console.error('Failed to fetch user info:', response.statusText);
			return null;
		}
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function checkEmailExist()
{
	const response = await fetch('https://localhost:8443/api/check-email/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
		},
		body: JSON.stringify({ email: email })
	})
	.then(response => response.json())
	then(data => {
		if (data.exists) {
			alert("This email already exists.");
		} else {
			alert("This email is available.");
		}
	})
	.catch(error => console.error('Error:', error));
}

export function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Si ce cookie commence par le nom recherché
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}