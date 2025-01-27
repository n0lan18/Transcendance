import { loadAuthentificationPage } from "./auth.js";
import { finishPageHTML } from "./game/finishPage.js";
import { loadHomePage } from "./home.js";
import { loadPreparationTournamentGamePage } from "./preparation-tournament-game-page.js";
import { loadTournamentPresentation } from "./tournament-presentation.js";
import { translation } from "./translate.js";

export function loadContent(appDiv, page, url, addToHistory, namePage, translate, eventListenerNavigator, eventListenerPage) {
	appDiv.innerHTML = page;
	if (typeof translate === "function")
		translate();
	if (typeof eventListenerNavigator === "function")
		eventListenerNavigator();
	if (typeof eventListenerPage === "function")
		eventListenerPage();
	if (addToHistory) {
		history.pushState({ page: page }, namePage, `/${url}`);
	}
}

export function replaceContent(appDiv, page, url, namePage, translate, eventListenerNavigator, eventListenerPage) {
	appDiv.innerHTML = page;
	if (typeof translate === "function")
		translate();
	if (typeof eventListenerNavigator === "function")
		eventListenerNavigator();
	if (typeof eventListenerPage === "function")
		eventListenerPage();
	history.replaceState({ page: page }, namePage, `/${url}`);
}

export async function getUserInfo()
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
			console.log('User: ', data);
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

export async function getStatsInfoAll()
{
	try
	{
		const jwtToken = localStorage.getItem('jwt_token');
		if (!jwtToken) {
			console.error('No token found in localStorage');
			loadAuthentificationPage();
			return null;
		}

		const response = await fetch('api/gamestats/', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			console.log(data);

			const firstStat = data.length > 0 ? data[0] : null;
			if (!firstStat)
				console.log('No game stats available.');
			return firstStat;
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

export async function getStatsInfoAllById(friend_id)
{
	try
	{
		const jwtToken = localStorage.getItem('jwt_token');
		if (!jwtToken) {
			console.error('No token found in localStorage');
			loadAuthentificationPage();
			return null;
		}

		const response = await fetch(`api/gamestats-friend/${friend_id}/`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			console.log(data);

			const firstStat = data.length > 0 ? data[0] : null;
			if (!firstStat)
				console.log('No game stats available.');
			return firstStat;
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

export async function getStatsInfo(pk)
{
	try
	{
		const response = await fetch(`api/gamestats/${pk}/`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			JSON.stringify(data, null, 2);
			console.log(data[0]);
			if (data.length > 0)
				return data[0];
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

export async function putStatsInfo(pk, data)
{
	console.log(data);
	try
	{
		const response = await fetch(`api/gamestats/${pk}/`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
		
		if (response.ok) {
			let updatedData = await response.json();
			console.log("Updated Data:", JSON.stringify(updatedData, null, 2));
			return updatedData;
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
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	} catch (error) {
		console.error('Error:', error);
		return null;
	}	
}

export async function putTournamentInfo(tabPlayers, numberMatchPlayed, courtColor, sizeTournament, superPower)
{
	const data = {
		tabPlayers: tabPlayers,
		numberMatchPlayed: numberMatchPlayed,
		courtColor: courtColor,
		sizeTournament: sizeTournament,
		superPower: superPower,
	};
	console.log(data);
	try
	{
		const response = await fetch(`api/create-tournament/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) {
			let updatedData = await response.json();
			console.log("Updated Data:", JSON.stringify(updatedData));
			return updatedData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function putTournamentInfoNewRound(sizeTournament, numberMatchPlayed, tabPlayersNewRound)
{
	const data = {
		tabPlayersNewRound: tabPlayersNewRound,
		numberMatchPlayed: numberMatchPlayed,
		sizeTournament: sizeTournament,
	};
	console.log(data);
	try
	{
		const response = await fetch(`api/new-round-tournament/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) {
			let updatedData = await response.json();
			console.log("Updated Data:", JSON.stringify(updatedData));
			return updatedData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function putTournamentInfoBasic(courtColor, sizeTournament, superPower)
{
	const data = {
		courtColor: courtColor,
		sizeTournament: sizeTournament,
		superPower: superPower,
	};
	console.log(data);
	try
	{
		const response = await fetch(`api/create-tournament-basic/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) {
			let updatedData = await response.json();
			console.log("Updated Data:", JSON.stringify(updatedData));
			return updatedData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}	
}

export async function getTournamentBasicInfo()
{
	try
	{
		const jwtToken = localStorage.getItem('jwt_token');
		if (!jwtToken) {
			console.error('No token found in localStorage');
			loadAuthentificationPage();
			return null;
		}

		const response = await fetch('api/create-tournament-basic/', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			return (data);
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

export async function getTournamentInfoBasic()
{
	try
	{
		const jwtToken = localStorage.getItem('jwt_token');
		if (!jwtToken) {
			console.error('No token found in localStorage');
			loadAuthentificationPage();
			return null;
		}

		const response = await fetch('api/create-tournament-basic/', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			return (data);
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

export async function putMatchInfo(username1, username2, courtColor, colorPlayer1, colorPlayer2, heroPowerPlayer1, heroPowerPlayer2, typeOfGame, numberPlayers, modeGame, superPower)
{
	const data = {
		username1: username1,
		username2: username2,
		colorPlayer1: colorPlayer1,
		colorPlayer2: colorPlayer2,
		heroPowerPlayer1: heroPowerPlayer1,
		heroPowerPlayer2: heroPowerPlayer2,
		typeOfGame: typeOfGame,
		numberPlayers: numberPlayers,
		modeGame: modeGame,
		superPower: superPower,
		courtColor: courtColor,
	};
	console.log(data);
	try
	{
		const response = await fetch(`api/match-user-info/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) {
			let updatedData = await response.json();
			console.log("Updated Data:", JSON.stringify(updatedData));
			return updatedData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}	
}

export async function getMatchInfo()
{
	try
	{
		const jwtToken = localStorage.getItem('jwt_token');
		if (!jwtToken) {
			console.error('No token found in localStorage');
			loadAuthentificationPage();
			return null;
		}

		const response = await fetch('api/match-user-info/', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
					'Content-Type': 'application/json',
				}
			});
		
		if (response.ok) {
			let data = await response.json();
			return (data);
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


export async function removeTournament()
{
	try
	{
		const response = await fetch(`api/remove-tournament/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
		})
		if (response.ok) {
			let updatedData = await response.json();
			console.log("Updated Data:", JSON.stringify(updatedData));
			return updatedData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function insertWinnerInTabNewRound(tabPlayersNewRound)
{
	const data = {
		tabPlayersNewRound: tabPlayersNewRound,
	};
	try
	{
		const response = await fetch(`api/insert-winner-in-tab/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) {
			let updatedData = await response.json();
			console.log("Updated Data:", JSON.stringify(updatedData));
			return updatedData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function getTournamentInfo()
{
	try
	{
		const response = await fetch(`api/create-tournament/`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
		})
		if (response.ok) {
			let valueData = await response.json();
			console.log("value Data:", JSON.stringify(valueData));
			return valueData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function checkIsTournament()
{
	try
	{
		const response = await fetch(`api/check-tournament/`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
		})
		if (response.ok) {
			let valueData = await response.json();
			console.log("value Data:", JSON.stringify(valueData));
			return valueData;
		}
		else if (response.status === 400)
		{
			let valueData = await response.json();
			console.log("value Data:", JSON.stringify(valueData));
			console.log(valueData)
			return null;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}	
}

export async function removeUserInPlayerOnline()
{
	try
	{
		const response = await fetch(`api/remove-online-list/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
		})
		if (response.ok) {
			let valueData = await response.json();
			console.log("value Data:", JSON.stringify(valueData));
			return valueData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}	
}

export async function connectedUsersList()
{
	try
	{
		const response = await fetch(`api/connected-users/`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
		})
		if (response.ok) {
			let valueData = await response.json();
			console.log("value Data:", JSON.stringify(valueData));
			return valueData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error('Erreur détaillée:', errorData);
            } else {
                const errorText = await response.text();
                console.error('Erreur non-JSON:', errorText);
            }
			return null;
		}
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}	
}

export async function addFriend(friend_id)
{
	const data = {
		id: friend_id,
	};
	console.log(data);
	try
	{
		const response = await fetch(`api/add-friend/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) {
			let valueData = await response.json();
			console.log("value Data:", JSON.stringify(valueData));
			return valueData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				const errorData = await response.json();
				console.error('Erreur détaillée:', errorData);
			} else {
				const errorText = await response.text();
				console.error('Erreur non-JSON:', errorText);
			}
			return null;
		}
	
	}
	catch (error) {
		console.error('Error:', error);
		return null;
	}
}

export async function removeFriend(friend_id)
{
	const data = {
		id: friend_id,
	};
	console.log(data);
	try
	{
		const response = await fetch(`api/remove-friend/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) {
			let valueData = await response.json();
			console.log("value Data:", JSON.stringify(valueData));
			return valueData;
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
			console.error('Failed to fetch tournament info:', response.statusText);
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				const errorData = await response.json();
				console.error('Erreur détaillée:', errorData);
			} else {
				const errorText = await response.text();
				console.error('Erreur non-JSON:', errorText);
			}
			return null;
		}
	
	}
	catch (error) {
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

export function isValidUsernameBad(username) {
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
	let sizeContainerProgressBar;
	if (containerProgressBar)
	{
		sizeContainerProgressBar = window.getComputedStyle(containerProgressBar).width;
		return parseInt(sizeContainerProgressBar);
	}
	return null;
}

export function emptySizePowerBar()
{
	const containerProgressBar = document.getElementById("progress-bar-left-container");
	if (containerProgressBar)
	{
		let emptySizeBar = parseInt(window.getComputedStyle(containerProgressBar).width);
		let emptySizeValue = emptySizeBar * 0.60;
		return parseInt(emptySizeValue);
	}
	return null;
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

export function isValidUsername(username)
{
	const regex = /^[a-zA-Z0-9@.+_-]+$/;
	return regex.test(username);
}

export function decodeStrToHex(color)
{
	return parseInt(color, 16)
}

export function isUserInList(list, user)
{
	for (let i = 0; i < list.length; i++)
	{
		if (list[i].username == user)
			return (true);		
	}
	return (false);
}

export function saveData(data, element) {
    const formData = {
        data: element.value,
	}
    sessionStorage.setItem(data + "Pong", JSON.stringify(formData));
}

export function loadDataStorage(data) {
	const savedData = sessionStorage.getItem(data + "Pong");
	let value;
	if (savedData)
	{
		const formData = JSON.parse(savedData);
		return formData.data;
	}
	return null
}

export async function InfoDataMatchTournament(username1, username2, scoreLeftPlayer, scoreRightPlayer, tabNewRound)
{
	await insertWinnerInTabNewRound(tabNewRound);
	let userInfo = await getUserInfo();
	await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRightPlayer});
	await putStatsInfo(6, {numberMatchTournament: 1});
	if ((userInfo.username == username1 && scoreLeftPlayer > scoreRightPlayer) || (userInfo.username == username2 && scoreRightPlayer > scoreLeftPlayer))
	{
		await putStatsInfo(2, {resultats: "V"})
		await putStatsInfo(7, {numberVictoryMatchTournament: 1});
		if ((userInfo.username == username2 && scoreRightPlayer > scoreLeftPlayer))
		{
			await putStatsInfo(13, {numberGoalsWin: scoreRightPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreLeftPlayer})
		}
		else
		{
			await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreRightPlayer})
		}
	}
	else
	{
		await putStatsInfo(2, {resultats: "D"})
		if (scoreRightPlayer > scoreLeftPlayer)
		{
			await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreRightPlayer})
		}
		else
		{
			await putStatsInfo(13, {numberGoalsWin: scoreRightPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreLeftPlayer})
		}
	}
}

export async function InfoDataMatchTournamentFinale(username1, username2, numberPlayer, scoreLeftPlayer, scoreRigthPlayer)
{
	let userInfo = await getUserInfo();
	await putStatsInfo(6, {numberMatchTournament: 1});
	if ((userInfo.username == username1 && scoreLeftPlayer > scoreRigthPlayer) || (userInfo.username == username2 && scoreRigthPlayer > scoreLeftPlayer))
	{
		await putStatsInfo(7, {numberVictoryMatchTournament: 1})
		await putStatsInfo(8, {numberVictoryTournament: 1})
		await putStatsInfo(2, {resultats: "V"})
		if (scoreLeftPlayer > scoreRigthPlayer)
		{
			await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreRigthPlayer})
		}
		else
		{
			await putStatsInfo(13, {numberGoalsWin: scoreRightPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreLeftPlayer})
		}
	}
	else
	{
		await putStatsInfo(2, {resultats: "D"})
		if (scoreLeftPlayer > scoreRigthPlayer)
		{
			await putStatsInfo(13, {numberGoalsWin: scoreRightPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreLeftPlayer})
		}
		else
		{
			await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
			await putStatsInfo(14, {numberGoalLose: scoreRigthPlayer})
		}
	}
	if (numberPlayer == 1)
		numberPlayer = 2;
	await putStatsInfo(15, {bestResultTournament: numberPlayer})
	await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRigthPlayer})
}

export async function InfoDataSimpleMatch(scoreLeftPlayer, scoreRightPlayer, isWin, modeGame)
{
	if (modeGame == "multiPlayerTwo")
	{
		await putStatsInfo(3, {numberSimpleMatch: 1});
		if (isWin == true)
		{
			await putStatsInfo(2, {resultats: "V"})
			await putStatsInfo(4, {numberVictorySimpleMatch: 1})
		}
		else
			await putStatsInfo(2, {resultats: "D"})
		await putStatsInfo(13, {numberGoalsWin: scoreLeftPlayer})
		await putStatsInfo(14, {numberGoalLose: scoreRightPlayer})
		await putStatsInfo(1, {scores: scoreLeftPlayer + "-" + scoreRightPlayer})
	}
}