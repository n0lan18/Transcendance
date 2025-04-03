# import requests
# from django.conf import settings
# from django.contrib.auth import get_user_model
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework_simplejwt.tokens import RefreshToken, TokenError
# from .models import OnlinePlayers


# User = get_user_model()

# class FortyTwoLoginView(APIView):
#     permission_classes = [AllowAny]
    
#     def post(self, request, *args, **kwargs):
#         # 1. 42 API 인증 코드 받기
#         code = request.data.get('code')
#         if not code:
#             return Response({"error": "인증 코드가 필요합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
#         # 2. 코드로 액세스 토큰 요청하기
#         token_url = 'https://api.intra.42.fr/oauth/token'
#         client_id = 'u-s4t2ud-b97b0db1e00350b47d617f27f71bb2d308e79fdc7aab34f91e993902e3342516'
#         client_secret = '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'
#         redirect_uri = request.data.get('redirect_uri', f"{settings.LOCAL_ADDRESS}/oauth-callback.html")
        
#         token_data = {
#             'grant_type': 'authorization_code',
#             'client_id': client_id,
#             'client_secret': client_secret,
#             'code': code,
#             'redirect_uri': redirect_uri
#         }
        
#         try:
#             # 액세스 토큰 요청
#             token_response = requests.post(token_url, data=token_data)
#             token_response.raise_for_status()
#             token_json = token_response.json()
#             access_token = token_json.get('access_token')
            
#             # 3. 액세스 토큰으로 사용자 정보 요청
#             user_api_url = 'https://api.intra.42.fr/v2/me'
#             headers = {'Authorization': f'Bearer {access_token}'}
#             user_response = requests.get(user_api_url, headers=headers)
#             user_response.raise_for_status()
#             user_data = user_response.json()
            
#             # 4. 사용자 정보 처리 (찾기 또는 생성)
#             email = user_data.get('email')
#             username = user_data.get('login')
            
            
#             try:
#                 # 이메일로 사용자 찾기
#                 user = User.objects.get(email=email)
#             except User.DoesNotExist:
#                 # 새 사용자 생성
#                 user = User.objects.create_user(
#                     username=username,
#                     email=email,
#                     password=None  # 42 로그인은 패스워드 불필요
#                 )
               
#                 if not GameStatsLocal.objects.filter(user=user).exists():
#             # 사용자에게 통계 데이터가 없으면 초기화
#                     from .models import GameStatsLocal
#                     game_stats = GameStatsLocal(user=user)
#                     # 기본 통계 초기화
#                     game_stats.scores = []
#                     game_stats.resultats = []
#                     game_stats.dates = []  # 이 필드도 필요하면 추가
#                     game_stats.numberSimpleMatch = 0
#                     game_stats.numberVictorySimpleMatch = 0
#                     # game_stats.numberTournament = 0
#                     game_stats.numberMatchTournament = 0
#                     game_stats.numberVictoryMatchTournament = 0
#                     game_stats.numberVictoryTournament = 0
#                     game_stats.heroInvisible = 0
#                     game_stats.heroDuplication = 0
#                     game_stats.heroSuperstrength = 0
#                     game_stats.heroTimelaps = 0
#                     game_stats.numberGoalsWin = 0
#                     game_stats.numberGoalLose = 0
#                     game_stats.bestResultTournament = 64
#                     game_stats.save()
#             user.save()
            
#             # 온라인 상태 추가
#             if not OnlinePlayers.objects.filter(user=user).exists():
#                 OnlinePlayers.objects.create(user=user)
            
#             # 5. JWT 토큰 발급
#             refresh = RefreshToken.for_user(user)
            
#             return Response({
#                 'access': str(refresh.access_token),
#                 'refresh': str(refresh),
#                 'user': {
#                     'id': user.id,
#                     'username': user.username,
#                     'email': user.email
#                 }
#             })
            
#         except requests.exceptions.RequestException as e:
#             return Response({"error": f"API 요청 오류: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import OnlinePlayers, GameStatsLocal  # GameStatsLocal 추가
import logging  # 로깅 추가

# 로깅 설정
logger = logging.getLogger(__name__)

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
                logger.info(f"42 유저 로그인: {username}, {email}")
            except User.DoesNotExist:
                # 새 사용자 생성
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=None  # 42 로그인은 패스워드 불필요
                )
                user.save()
                logger.info(f"42 유저 생성: {username}, {email}")
            
            # 5. 통계 데이터 확인 및 생성
            try:
                if not GameStatsLocal.objects.filter(user=user).exists():
                    # 통계 초기화
                    game_stats = GameStatsLocal(user=user)
                    # 기본 통계 초기화
                    game_stats.scores = []
                    game_stats.resultats = []
                    game_stats.dates = []
                    game_stats.numberSimpleMatch = 0
                    game_stats.numberVictorySimpleMatch = 0
                    game_stats.numberTournament = 0  # 오타 수정
                    game_stats.numberMatchTournament = 0
                    game_stats.numberVictoryMatchTournament = 0
                    game_stats.numberVictoryTournament = 0
                    game_stats.heroInvisible = 0
                    game_stats.heroDuplication = 0
                    game_stats.heroSuperstrength = 0
                    game_stats.heroTimelaps = 0
                    game_stats.numberGoalsWin = 0
                    game_stats.numberGoalLose = 0
                    game_stats.bestResultTournament = 64
                    game_stats.save()
                    logger.info(f"42 유저 통계 초기화 완료: {username}")
            except Exception as e:
                logger.error(f"통계 초기화 오류: {e}")
            
            # 6. 온라인 상태 추가
            if not OnlinePlayers.objects.filter(user=user).exists():
                OnlinePlayers.objects.create(user=user)
            
            # 7. JWT 토큰 발급
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
            logger.error(f"API 요청 오류: {e}")
            return Response({"error": f"API 요청 오류: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능
    
    def post(self, request):
        try:
            # 디버깅 정보 출력
            print(f"Logout request from user: {request.user}")
            
            # 온라인 상태 제거
            try:
                user = request.user
                online_player = OnlinePlayers.objects.filter(user=user).first()
                if online_player:
                    online_player.delete()
                    print(f"Removed user {user.username} from online players")
                else:
                    print(f"User {user.username} not found in online players")
            except Exception as e:
                print(f"Error removing online status: {e}")
            
            # JWT 블랙리스트에 리프레시 토큰 추가
            try:
                refresh_token = request.data.get('refresh')
                if refresh_token:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                    print(f"Blacklisted refresh token for user {request.user.username}")
                else:
                    print("No refresh token provided for blacklisting")
            except TokenError as e:
                print(f"Error blacklisting token: {e}")
            except Exception as e:
                print(f"Unexpected error during token blacklisting: {e}")
            
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error in logout view: {e}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)