export async function loadHomePage()
{
	let userInfo = await fetchUserInfo();
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

function generateHomePageHTML(userInfo)
{
	let welcome = "Welcome";
	if (!userInfo) {
		return `
			<div id="homepage">
				<h1>${welcome} Guest</h1>
			</div>	
		`;
	}

	return `
		<div id="homepage">
			<h1>${welcome} ${userInfo.username}</h1>
			<p>${userInfo.email}</p>
		</div>
	`;
}

