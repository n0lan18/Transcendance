import { loadAuthentificationPage } from "../auth.js";
import { loadHomePage } from "../home.js";
import { reorderLanguages, translation, changeLanguage } from "../translate.js";
import { loadFriendsPage } from "../friends.js";
import { removeUserInPlayerOnline } from "../utils.js";

export function addNavigatorEventListeners()
{
	const lang = localStorage.getItem('language') || 'en';
	switchPageToHome();
	switchPageToLogout();
	switchPageToFriends()
	reorderLanguages(lang);

	const languageSelect = document.getElementById('language-select');
	if (languageSelect)
	{
		languageSelect.addEventListener('change', (event) => {
			changeLanguage(event.target.value);
			translation(event.target.value)
		});
	}
}

function switchPageToHome()
{
	let switchPageToHome = document.getElementById("home-button");
	if (switchPageToHome)
	{
		switchPageToHome.addEventListener('click', function (event) {
			event.preventDefault();
			loadHomePage();
		});
	}
}

function switchPageToFriends()
{
	let switchPageToFriends = document.getElementById('friends-button');
	if (switchPageToFriends)
	{
		switchPageToFriends.addEventListener('click', function (event)
		{
			event.preventDefault();
			loadFriendsPage();
		});
	}
}

function switchPageToLogout()
{
    let switchPageToLogout = document.getElementById("logoutLink");
    if (switchPageToLogout)
    {
        switchPageToLogout.addEventListener('click', async function (event) {
            event.preventDefault();
            
            try {
                // 1. 온라인 사용자 목록에서 제거 (이 부분은 되는 경우만 유지)
                await removeUserInPlayerOnline();
                
            } catch (error) {
                console.error('Online status removal error:', error);
            } finally {
                // 로그인 방식 확인 (42 OAuth 로그인 여부)
                const loginMethod = localStorage.getItem('login_method');
                console.log('로그아웃 시 확인된 로그인 방식:', loginMethod);
                
                // 명확하게 42_oauth인 경우에만 42 인트라 페이지 열기
                const isOAuth42Login = loginMethod === '42_oauth';
                
                // 2. 로컬 스토리지에서 토큰들 제거 (항상 실행)
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('login_method'); // 로그인 방식도 제거
                localStorage.removeItem('is_42_user');   // 42 사용자 표시도 제거
                
                // 3. 42 OAuth 로그인 사용자인 경우에만 42 인트라 프로필 페이지 열기
                if (isOAuth42Login) {
                    console.log('42 OAuth 로그인 사용자 - 인트라 페이지 열기');
                    window.open('https://profile.intra.42.fr/', '_blank');
                } else {
                    console.log('일반 로그인 사용자 - 인트라 페이지 열지 않음');
                }
                
                // 4. 로그인 페이지로 리디렉션 (항상 실행)
                loadAuthentificationPage();
            }
        });
    }
}
