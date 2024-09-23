
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
		} else {
			console.error('Failed to fetch user info:', response.statusText);
			return null;
		}
	} catch (error) {
		console.error('Error:', error);
		return null;
	}
}