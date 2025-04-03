// 42 OAuth 인증 처리를 위한 모듈

// 42 API 클라이언트 정보
const FORTYTWO_CLIENT_ID = 'u-s4t2ud-b97b0db1e00350b47d617f27f71bb2d308e79fdc7aab34f91e993902e3342516';
const REDIRECT_URI = `https://localhost:8443/oauth-callback.html`;



// 1. 42 로그인 버튼 초기화
export function initOAuth42Login() {
    const loginButton = document.getElementById('btn-42-login');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
			
            // 메시지 박스 표시
            if (confirm('No support for online mode. Logout is done in INTRA. Do you agree?')) {
                startOAuth42Login();
            }
        });
    }
}

// 2. 42 OAuth 인증 시작
export function startOAuth42Login() {
    // 42 인증 페이지로 리다이렉트
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${FORTYTWO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    window.location.href = authUrl;
}

// 3. OAuth 콜백 처리
export async function handleOAuth42Callback() {
    // URL에서 코드 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorMessage = urlParams.get('error');
    
    if (errorMessage) {
        displayError(`인증 오류: ${errorMessage}`);
        return;
    }
    
    if (!code) {
        displayError('인증 코드를 찾을 수 없습니다.');
        return;
    }
    
    try {
        // 백엔드로 코드 전송하여 JWT 토큰 요청
        const response = await fetch('/api/auth/42/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '인증 처리 중 오류가 발생했습니다.');
        }
        
        // 응답에서 JWT 토큰 추출
        const data = await response.json();
        
        // JWT 토큰 저장
        localStorage.setItem('jwt_token', data.access);
        localStorage.setItem('refresh_token', data.refresh); // 리프레시 토큰도 저장
		localStorage.setItem('login_method', '42_oauth');
        // 로그인 성공 후 홈페이지로 이동
        window.location.href = '/home';
        
    } catch (error) {
        console.error('42 로그인 오류:', error);
        displayError(error.message);
    }
}

// 오류 메시지 표시 도우미 함수
function displayError(message) {
    const errorElement = document.getElementById('oauth-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        console.error('오류:', message);
    }
}