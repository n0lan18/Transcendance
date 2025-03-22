import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import OnlinePlayers

User = get_user_model()

class FortyTwoLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # 1. 42 API 인증 코드 받기
        code = request.data.get('code')
        if not code:
            return Response({"error": "인증 코드가 필요합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        # 2. 코드로 액세스 토큰 요청하기
        token_url = 'https://api.intra.42.fr/oauth/token'
        client_id = 'u-s4t2ud-b97b0db1e00350b47d617f27f71bb2d308e79fdc7aab34f91e993902e3342516'
        client_secret = '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'
        redirect_uri = request.data.get('redirect_uri', f"{settings.LOCAL_ADDRESS}/oauth-callback.html")
        
        token_data = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': redirect_uri
        }
        
        try:
            # 액세스 토큰 요청
            token_response = requests.post(token_url, data=token_data)
            token_response.raise_for_status()
            token_json = token_response.json()
            access_token = token_json.get('access_token')
            
            # 3. 액세스 토큰으로 사용자 정보 요청
            user_api_url = 'https://api.intra.42.fr/v2/me'
            headers = {'Authorization': f'Bearer {access_token}'}
            user_response = requests.get(user_api_url, headers=headers)
            user_response.raise_for_status()
            user_data = user_response.json()
            
            # 4. 사용자 정보 처리 (찾기 또는 생성)
            email = user_data.get('email')
            username = user_data.get('login')
            
            try:
                # 이메일로 사용자 찾기
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # 새 사용자 생성
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=None  # 42 로그인은 패스워드 불필요
                )
                user.save()
            
            # 온라인 상태 추가
            if not OnlinePlayers.objects.filter(user=user).exists():
                OnlinePlayers.objects.create(user=user)
            
            # 5. JWT 토큰 발급
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
            
        except requests.exceptions.RequestException as e:
            return Response({"error": f"API 요청 오류: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)