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
		const response = await fetch('api/userinfo/', {
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
	const response = await fetch('check-email/', {
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

export function escapeHTML(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
		.replace(/[\s\u200B\u200C\u200D\u200E\u200F]/g, '');
}

export function isValidUsername(username) {
	return username.length >= 1 && username.length <= 9;
}

export function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function rgbToHex(rgbString) {
	const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
    const result = regex.exec(rgbString);
	if (result)
	{
		const r = parseInt(result[1], 10);
		const g = parseInt(result[2], 10);
		const b = parseInt(result[3], 10);
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();	
	}
	else
		return null;
}

export function fullSizePowerBar()
{
	const containerProgressBar = document.getElementById("progress-bar-left-container");
	let sizeContainerProgressBar = window.getComputedStyle(containerProgressBar).width;
	return parseInt(sizeContainerProgressBar);
}

export function emptySizePowerBar()
{
	const containerProgressBar = document.getElementById("progress-bar-left-container");
	let emptySizeBar = parseInt(window.getComputedStyle(containerProgressBar).width);
	let emptySizeValue = emptySizeBar * 0.60;
	return parseInt(emptySizeValue);
}

export function sizeOfStep(fullSizePowerBar, emptySizePowerBar)
{
	let sizeOfStep = (fullSizePowerBar - emptySizePowerBar) / 10;
	return sizeOfStep;
}

export function sizeOfAdvance(fullSizePowerBar, emptySizePowerBar)
{
	return fullSizePowerBar - emptySizePowerBar;
}