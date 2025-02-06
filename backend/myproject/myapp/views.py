from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import get_object_or_404
from random import shuffle
from rest_framework.exceptions import NotFound
from datetime import datetime
import re
from datetime import date
import html
from django.core.exceptions import ObjectDoesNotExist


from .models import User
from .serializers import UserSerializer
from .models import GameStatsLocal
from .serializers import GameStatsLocalSerializer
from .serializers import FriendSerializer
from .models import TournamentUser
from .serializers import TournamentSerializer
from .models import OnlinePlayers
from .models import MatchUser
from .serializers import MatchSerializer
from .models import MatchHistoryUser
from .serializers import MatchHistoryUserSerializer

class RegisterView(APIView):
	permission_classes = [AllowAny]
	def post(self, request, *args, **kwargs):
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			email = request.data.get('email')
			username = request.data.get('username')
			password = request.data.get('password')
			if not email:
				return Response({"error": "No email provided"}, status=status.HTTP_400_BAD_REQUEST)
			if User.objects.filter(email=email).exists():
				return Response({"exists": True, "message": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
			email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$'
			if not re.match(email_regex, email):
				return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)
			
			if not username:
				return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)
			if User.objects.filter(username=username).exists():
				return Response({"exists": True, "message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
			username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
			if not re.match(username_regex, username):
				return Response({"error": "Invalid username format"}, status=status.HTTP_400_BAD_REQUEST)
			
			if not password:
				return Response({"error": "No password provided"}, status=status.HTTP_400_BAD_REQUEST)
			password_regex = r"^(?=.*[a-zA-Z])(?=.*[0-9.#?!&]).{10,}$"
			if not re.match(password_regex, password):
				return Response({"error": "Invalid password format"}, status=status.HTTP_400_BAD_REQUEST)

			serializer.save() 
			return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
		else:
			print(serializer.errors)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView): 
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		usernameOrEmail = request.data.get('emailUsername')
		password = request.data.get('password')
		safeUsernameOrEmail = html.escape(usernameOrEmail)
		safePassword = html.escape(password)

		if not safeUsernameOrEmail:
			return Response({"error": "No username or email provided"}, status=status.HTTP_400_BAD_REQUEST)
		email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
		if not re.match(email_regex, safeUsernameOrEmail):
			username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
			if not re.match(username_regex, safeUsernameOrEmail):
				return Response({"error": "Invalid username or email format"}, status=status.HTTP_400_BAD_REQUEST)
			
		if not safePassword:
			return Response({"error": "No password provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		user = authenticate(request, username=safeUsernameOrEmail, password=safePassword)
		if user is not None:
			if not OnlinePlayers.objects.filter(user=user).exists():
				OnlinePlayers.objects.create(user=user)
				print(f"Utilisateur {user.username} ajouté dans la table OnlinePlayers.")

			refresh = RefreshToken.for_user(user)
			return Response({
				'access': str(refresh.access_token),
				'refresh': str(refresh)
			}, status=status.HTTP_200_OK)
		else:
			return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserInfoView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		profile_photo_url = user.profile_photo.url if user.profile_photo else None
		if profile_photo_url:
			profile_photo_url = request.build_absolute_uri(profile_photo_url)
			profile_photo_url = profile_photo_url.replace('http://', 'https://')
			profile_photo_url = profile_photo_url.replace('https://localhost', settings.IP_ADDRESS)

		isConnect = user.isConnect

		friends_data = []
		for friend in user.friends.all():
			friend_profile_photo_url = friend.profile_photo.url if friend.profile_photo else None
			if friend_profile_photo_url:
				friend_profile_photo_url = request.build_absolute_uri(friend_profile_photo_url)
				friend_profile_photo_url = friend_profile_photo_url.replace('http://', 'https://')
				friend_profile_photo_url = friend_profile_photo_url.replace('https://localhost', settings.IP_ADDRESS)
			friends_data.append({
				'id': friend.id,
				'username': friend.username,
				'profile_photo': friend_profile_photo_url,
				'isConnect': friend.isConnect,
			})			

		return Response({
			'id': user.id,
			'username': user.username,
			'profile_photo': profile_photo_url,
			'friends': friends_data,
			'isConnect': isConnect
		})

class Friends(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, action, friend_id):
		user = request.user
		try:
			friend = User.objects.get(pk=friend_id)
			if action == "add":
				user.add_friend(friend)
				return Response({"message": "Friend added successfully"}, status=status.HTTP_200_OK)
			elif action == "remove":
				user.remove_friend(friend)
				return Response({"message": "Friend removed successfully"}, status=status.HTTP_200_OK)
			else:
				return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
		except User.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class CheckEmailView(APIView):
	permission_classes = [AllowAny]
    
	def post(self, request, *args, **kwargs):
		data = request.data.get('data', {})
		email = data.get('email')
		if not email:
			return Response({"error": "No email provided"}, status=status.HTTP_400_BAD_REQUEST)

		safeEmail = html.escape(email)
		if not safeEmail:
			return Response({"error": "No email provided"}, status=status.HTTP_400_BAD_REQUEST)

		email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
		if not re.match(email_regex, safeEmail):
			return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

		if User.objects.filter(email=safeEmail).exists():
			return Response({"exists": True, "message": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({"exists": False, "message": "Email does not exist."}, status=status.HTTP_200_OK)
		
			
class CheckUsernameView(APIView):
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		data = request.data.get('data', {})
		username = data.get('username')
		if not username:
			return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)

		safeUsername = html.escape(username)
		if not safeUsername:
			return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, safeUsername):
			return Response({"error": "Invalid username format"}, status=status.HTTP_400_BAD_REQUEST)

		if User.objects.filter(username=safeUsername).exists():
			return Response({"exists": True, "message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({"exists": False, "message": "Username does not exist."}, status=status.HTTP_200_OK)
		


class UpdateUsernameView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		username = request.data.get("username")
		if not username:
			return Response({"message": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)
		try:
			safeUsername = html.escape(username)
			print(f"Email échappé : {safeUsername}")			

		except Exception as e:
			return Response({"message": f"Error while processing email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		if not safeUsername:
			return Response({"message": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)
		
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, safeUsername):
			return Response({"message": "Invalid username format."}, status=status.HTTP_400_BAD_REQUEST)
		if User.objects.filter(username=safeUsername).exists():
			return Response({"exists": True, "message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
		if User.objects.filter(email=safeUsername).exists():
			return Response({"message": "Username already exist."}, status=status.HTTP_400_BAD_REQUEST)
		else:
			request.user.username = safeUsername
			request.user.save()
			return Response({"message": "Username updated successfully."}, status=status.HTTP_200_OK)
			

class UpdateIsConnectView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		isConnect = request.data.get("isConnect")
		if isConnect:
			request.user.isConnect = isConnect
			request.user.save()
			return Response({"message": "isConnect updated successfully."}, status=status.HTTP_200_OK)
		else:
			return Response({"message": "isConnect is required."}, status=status.HTTP_400_BAD_REQUEST)
			

class UpdateEmailView(APIView):
	permission_classes = [AllowAny]

	def put(self, request):
		email = request.data.get("email")
		if not email:
			return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
		try:
			safeEmail = html.escape(email)
			print(f"Email échappé : {safeEmail}")

		except Exception as e:
			return Response({"message": f"Error while processing email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		if not safeEmail:
			return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
		email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
		if not re.match(email_regex, safeEmail):
			return Response({"message": "Invalid email format."}, status=status.HTTP_400_BAD_REQUEST)
		if User.objects.filter(email=safeEmail).exists():
			return Response({"message": "Email already exist."}, status=status.HTTP_400_BAD_REQUEST)
		else:
			request.user.email = safeEmail
			request.user.save()
			return Response({"message": "Email updated successfully."}, status=status.HTTP_200_OK)

class UpdatePasswordView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		new_password = request.data.get("password")
		if not new_password:
			return Response({"message": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)

		password_regex = r"^(?=.*[a-zA-Z])(?=.*[0-9.#?!&]).{10,}$"
		if not re.match(password_regex, new_password):
			return Response({"error": "Invalid password format"}, status=status.HTTP_400_BAD_REQUEST)
		user = request.user
		user.set_password(new_password)
		user.save()
		return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

class UpdateImageView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		profile_photo = request.FILES.get('image', None)
		if not profile_photo:
			return Response({"message": "Image is required."}, status=status.HTTP_400_BAD_REQUEST)
		
		ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
		ext = profile_photo.name.split('.')[-1].lower()
		if ext not in ALLOWED_EXTENSIONS:
			return Response({"message": "Invalid file extension"}, status=status.HTTP_400_BAD_REQUEST)

		if profile_photo:
			user = request.user
			user.profile_photo = profile_photo
			user.save()
			return Response({"message": "Profile image updated successfully."}, status=status.HTTP_200_OK)
			

class UpdateIsConnectView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		isConnect = request.data.get("isConnect")
		if isConnect:
			user = request.user
			user.isConnect = isConnect
			user.save()
			return Response({"message": "Profile isConnect updated successfully."}, status=status.HTTP_200_OK)
		else:
			return Response({"message": "isConnect is required."}, status=status.HTTP_400_BAD_REQUEST)

class GameStatsLocalByIdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
		# Vérifie si l'utilisateur avec cet ID existe
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("Utilisateur introuvable.")

		# Récupère uniquement les statistiques de cet utilisateur
        game_stats = GameStatsLocal.objects.filter(user=user)
        serializer = GameStatsLocalSerializer(game_stats, many=True)
        return Response(serializer.data)

class GameStatsLocalListUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        ALLOWED_RESULT = {'D', 'V'}
        ALLOWED_TOURNAMENT_STAGES = {32, 16, 8, 4, 2}
		
        game_stat = get_object_or_404(GameStatsLocal, user=request.user)
        data = request.data
        resultats = request.data.get('resultats')
        if not resultats:
            return Response({"error": "No resultats provided"}, status=status.HTTP_400_BAD_REQUEST)
        if resultats not in ALLOWED_RESULT:
            return Response({"error": "Invalid resultats format"}, status=status.HTTP_400_BAD_REQUEST)
        regex_goal = r'^[0-5]$'
        numberGoalsWin = request.data.get('numberGoalsWin')
        if numberGoalsWin is None:
            return Response({"error": "No numberGoalsWin provided"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(regex_goal, str(numberGoalsWin)):
            return Response({"error": "Invalid numberGoalsWin format"}, status=status.HTTP_400_BAD_REQUEST)		
        numberGoalLose = request.data.get('numberGoalLose')
        if numberGoalLose is None:
            return Response({"error": "No numberGoalLose provided"}, status=status.HTTP_400_BAD_REQUEST)
        if not re.match(regex_goal, str(numberGoalLose)):
            return Response({"error": "Invalid numberGoalLose format"}, status=status.HTTP_400_BAD_REQUEST)
        numberVictoryTournament = request.data.get('numberVictoryTournament')
        if numberVictoryTournament is None:
            return Response({"error": "No numberVictoryTournament provided"}, status=status.HTTP_400_BAD_REQUEST)
        if numberVictoryTournament != 1 and numberVictoryTournament != 0:
            return Response({"error": "Invalid numberVictoryTournament format"}, status=status.HTTP_400_BAD_REQUEST)
        bestResultTournament = request.data.get('bestResultTournament')
        if bestResultTournament is None:
            return Response({"error": "No bestResultTournament provided"}, status=status.HTTP_400_BAD_REQUEST)
        if bestResultTournament not in ALLOWED_TOURNAMENT_STAGES:
            return Response({"error": "Invalid bestResultTournament format"}, status=status.HTTP_400_BAD_REQUEST)			

        if bestResultTournament < game_stat.bestResultTournament:
            game_stat.bestResultTournament = bestResultTournament

        game_stat.numberVictoryTournament += numberVictoryTournament

        game_stat.numberSimpleMatch += 1

        if resultats == 'V':
            game_stat.numberVictorySimpleMatch += 1

        game_stat.numberGoalsWin += numberGoalsWin

        game_stat.numberGoalLose += numberGoalLose			

        game_stat.scores.append(str(numberGoalsWin) + '-' + str(numberGoalLose))
        while len(game_stat.scores) > 5:
            game_stat.scores.pop(0)
        game_stat.dates.append(datetime.now().date())
        while len(game_stat.dates) > 5:
            game_stat.dates.pop(0)
        game_stat.resultats.append(resultats)
        while len(game_stat.resultats) > 5:
            game_stat.resultats.pop(0)

        game_stat.save()
        return Response({"message": "Game statistics updated successfully."}, status=status.HTTP_200_OK)


class GameStatsLocalListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
		# Récupère uniquement les statistiques de l'utilisateur connecté
        game_stats = GameStatsLocal.objects.filter(user=request.user)
        serializer = GameStatsLocalSerializer(game_stats, many=True)
        return Response(serializer.data)
	

class GameStatsLocalDetailView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, pk):
		# Récupère une statistique spécifique pour l'utilisateur connecté
		fields_map = {
			1: 'scores',
			2: 'resultats',
			3: 'numberSimpleMatch',
			4: 'numberVictorySimpleMatch',
			5: 'numberTournament',
			6: 'numberMatchTournament',
			7: 'numberVictoryMatchTournament',
			8: 'numberVictoryTournament',
			9: 'heroInvisible',
			10: 'heroDuplication',
			11: 'heroSuperstrength',
			12: 'heroTimelaps',
			13: 'numberGoalsWin',
			14: 'numberGoalLose',
			15: 'bestResultTournament'
		}

		field_name = fields_map.get(pk)
		if field_name:
			game_stats = GameStatsLocal.objects.filter(user=request.user).values(field_name)
			return Response(game_stats)
		else:
			return Response({"error": "Invalid pk value"}, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk):
		# Met à jour une statistique de jeu spécifique en fonction du `pk`
		field_map = {
			1: 'scores',
			2: 'resultats',
			3: 'numberSimpleMatch',
			4: 'numberVictorySimpleMatch',
			5: 'numberTournament',
			6: 'numberMatchTournament',
			7: 'numberVictoryMatchTournament',
			8: 'numberVictoryTournament',
			9: 'heroInvisible',
			10: 'heroDuplication',
			11: 'heroSuperstrength',
			12: 'heroTimelaps',
			13: 'numberGoalsWin',
			14: 'numberGoalLose',
			15: 'bestResultTournament'
		}

		valid_resultats = {"D", "V"}
		valid_tournament_stages = {64, 32, 16, 8, 4, 2}

		# Obtenez le champ en fonction de `pk`
		field_name = field_map.get(pk)
		if not field_name:
			return Response({"error": "Invalid pk value"}, status=status.HTTP_400_BAD_REQUEST)
		
		game_stat = get_object_or_404(GameStatsLocal, user=request.user)
		new_value = request.data.get(field_name)
		current_value = getattr(game_stat, field_name, None)
		if new_value is not None:
			if pk == 1 or pk == 2:
				if pk == 1:
					regex = r'^(100|[1-9]?[0-9])-(100|[1-9]?[0-9])$'
					if not re.match(regex, str(new_value)):
						return Response({"error": f"Invalid scores value for {field_name}. Expected format is 'number1-number2' where both numbers are between 0 and 100."}, status=status.HTTP_400_BAD_REQUEST)
				elif pk == 2:
					if new_value not in valid_resultats:
						return Response({"error": f"Invalid resultats value for {field_name}"}, status=status.HTTP_400_BAD_REQUEST)
				
				if isinstance(current_value, list):
					current_value.append(new_value)
					while len(current_value) > 5:
						current_value.pop(0)
					setattr(game_stat, field_name, current_value)  # Mettez à jour le champ spécifié
				else:
					return Response({"error": f"{field_name} is not a list field"}, status=status.HTTP_400_BAD_REQUEST)
			
			elif pk >= 3 and pk <= 12:
				if isinstance(current_value, int):
					setattr(game_stat, field_name, current_value + 1)
				else:
					return Response({"error": f"{field_name} is not an integer field"}, status=status.HTTP_400_BAD_REQUEST)

			elif pk >= 13 and pk <= 14:
				if isinstance(current_value, int):
					setattr(game_stat, field_name, current_value + new_value)
				else:
					return Response({"error": f"{field_name} is not an integer field"}, status=status.HTTP_400_BAD_REQUEST)
			
			elif pk == 15:
				try:
					new_result = int(new_value)
				except ValueError:
					return Response({"error": f"Invalid value for {field_name}"}, status=status.HTTP_400_BAD_REQUEST)
				
				if new_result in valid_tournament_stages:
					if current_value is None or new_result < current_value:
						setattr(game_stat, field_name, new_result)
				else:
					return Response({"error": f"Invalid tournament stage value for {field_name}. Valid values are 64, 32, 16, 8, 4, 2."}, status=status.HTTP_400_BAD_REQUEST)

			game_stat.save()  # Sauvegardez les modifications
			return Response({field_name: getattr(game_stat, field_name)})
		
		return Response({"error": f"Missing data for {field_name}"}, status=status.HTTP_400_BAD_REQUEST)



	def delete(self, request, pk):
		# Supprime une statistique de jeu
		game_stat = get_object_or_404(GameStatsLocal, pk=pk, user=request.user)
		game_stat.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
	


class CreateTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		print('request user', request.user)
		try:
			tournament_user = TournamentUser.objects.get(user=request.user)
			if (tournament_user):
				serialized = TournamentSerializer(tournament_user)
				print(serialized.data)
				return Response(serialized.data)
			else:
				return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
		except:
			return Response({"error": "TournamentUser not found for the current user."}, status=status.HTTP_404_NOT_FOUND)


	def put(self, request):
		print(request.data)

		user = request.user
		
		try:
			tournament_user = TournamentUser.objects.get(user=user)
			tournament_user.delete()
		except TournamentUser.DoesNotExist:
			print(f"No existing TournamentUser for {user}, creating a new one.")

		new_tournament_user = TournamentUser.objects.create(user=user)

		tabPlayers = request.data.get('tabPlayers')
		numberMatchPlayed = 0
		courtColor = request.data.get('courtColor')
		sizeTournament = request.data.get('sizeTournament')
		superPower = request.data.get('superPower')

		if not tabPlayers:
			return Response({"error": "tabPlayers missing."}, status=status.HTTP_404_NOT_FOUND)
		if not courtColor:
			return Response({"error": "Court color missing."}, status=status.HTTP_404_NOT_FOUND)
		if not sizeTournament:
			return Response({"error": "SizeTournament missing."}, status=status.HTTP_404_NOT_FOUND)
		if not superPower:
			return Response({"error": "SuperPower missing."}, status=status.HTTP_404_NOT_FOUND)

		if not isinstance(tabPlayers, list):
			return Response({'error': 'tabPlayers must be a list'}, status=400)
		shuffle(tabPlayers)
		tabPlayersNewRound = []
		if not isinstance(tabPlayersNewRound, list):
			return Response({'error': 'tabPlayers must be a list'}, status=400)
		ALLOWED_COURT_COLOR = {"#CF5A30", "#043976", "#0183CB", "#689D63"}
		ALLOWED_SIZE_TOURNAMENT = {4, 8, 16, 32}
		ALLOWED_SUPERPOWER = {"isSuperPower", "isNotSuperPower"}
		ALLOWED_POWER_PLAYER = {"Invisible", "Duplication", "Time laps", "Super strength"}

		if courtColor not in ALLOWED_COURT_COLOR:
			return Response({"error": "Invalid color court."}, status=status.HTTP_404_NOT_FOUND)
		if sizeTournament not in ALLOWED_SIZE_TOURNAMENT:
			return Response({"error": "Invalid size Tournament."}, status=status.HTTP_404_NOT_FOUND)
		if superPower not in ALLOWED_SUPERPOWER:
			return Response({"error": "Invalid Superpower."}, status=status.HTTP_404_NOT_FOUND)
		if len(tabPlayers) != sizeTournament:
			return Response({"error": "Invalid Member and sizeTournament."}, status=status.HTTP_404_NOT_FOUND)
		for i, player in enumerate(tabPlayers):
			if len(player) < 3:
				return Response({"error": f"Player {i} data is incomplete"}, status=status.HTTP_400_BAD_REQUEST)
			
			username = tabPlayers[i][0]
			power = tabPlayers[i][1]
			colorPaddel = tabPlayers[i][2]
			
			if not username:
				return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)
			username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
			if not re.match(username_regex, username):
				return Response({"error": "Invalid username format"}, status=status.HTTP_400_BAD_REQUEST)
			if not power:
				return Response({"error": "No power provided"}, status=status.HTTP_400_BAD_REQUEST)
			if power not in ALLOWED_POWER_PLAYER:
				return Response({"error": "Invalid Power Player."}, status=status.HTTP_404_NOT_FOUND)
			if not colorPaddel:
				return Response({"error": "No Color Paddel provided"}, status=status.HTTP_400_BAD_REQUEST)
			colorPaddel_regex = r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
			if not re.match(colorPaddel_regex, colorPaddel):
				return Response({"error": "Invalid colorPaddel format"}, status=status.HTTP_400_BAD_REQUEST)
		new_tournament_user.tabPlayers = tabPlayers
		new_tournament_user.tabPlayersNewRound = tabPlayersNewRound
		new_tournament_user.numberMatchPlayed = numberMatchPlayed
		new_tournament_user.courtColor = courtColor
		new_tournament_user.sizeTournament = sizeTournament
		new_tournament_user.superPower = superPower

		new_tournament_user.save()
		return Response({"message": "Tournament create successfull."}, status=status.HTTP_200_OK)
	
class CreateTournamentBasicView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		try:
			tournament_user = TournamentUser.objects.get(user=request.user)
		except TournamentUser.DoesNotExist:
			return Response({"error": "TournamentUser not found for the given user."}, status=status.HTTP_404_NOT_FOUND)
		if (tournament_user):
			serialized = TournamentSerializer(tournament_user)
			print(serialized.data)
			return Response(serialized.data)
		else:
			return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)


	def put(self, request):
		print(request.data)

		user = request.user
		
		try:
			tournament_user = TournamentUser.objects.get(user=user)
			tournament_user.delete()
		except TournamentUser.DoesNotExist:
			print(f"No existing TournamentUser for {user}, creating a new one.")

		new_tournament_user = TournamentUser.objects.create(user=user)

		courtColor = request.data.get('courtColor')
		sizeTournament = request.data.get('sizeTournament')
		superPower = request.data.get('superPower')
		if not courtColor:
			return Response({"error": "Court color missing."}, status=status.HTTP_404_NOT_FOUND)
		if not sizeTournament:
			return Response({"error": "SizeTournament missing."}, status=status.HTTP_404_NOT_FOUND)
		if not superPower:
			return Response({"error": "SuperPower missing."}, status=status.HTTP_404_NOT_FOUND)
		ALLOWED_COURT_COLOR = {"#CF5A30", "#043976", "#0183CB", "#689D63"}
		ALLOWED_SIZE_TOURNAMENT = {4, 8, 16, 32}
		ALLOWED_SUPERPOWER = {"isSuperPower", "isNotSuperPower"}
		if courtColor not in ALLOWED_COURT_COLOR:
			return Response({"error": "Invalid color court."}, status=status.HTTP_404_NOT_FOUND)
		if sizeTournament not in ALLOWED_SIZE_TOURNAMENT:
			return Response({"error": "Invalid size Tournament."}, status=status.HTTP_404_NOT_FOUND)
		if superPower not in ALLOWED_SUPERPOWER:
			return Response({"error": "Invalid Superpower."}, status=status.HTTP_404_NOT_FOUND)
		
		new_tournament_user.courtColor = courtColor
		new_tournament_user.sizeTournament = sizeTournament
		new_tournament_user.superPower = superPower

		new_tournament_user.save()
		return Response({"message": "Tournament create successfull."}, status=status.HTTP_200_OK)
	
class MatchInfoView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		
		match_user = MatchUser.objects.get(user=request.user)
		if (match_user):
			serialized = MatchSerializer(match_user)
			print(serialized.data)
			return Response(serialized.data)
		else:
			return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)


	def put(self, request):

		user = request.user
		
		try:
			match_user = MatchUser.objects.filter(user=user)
			match_user.delete()
		except MatchUser.DoesNotExist:
			print(f"No existing MatchUser for {user}, creating a new one.")

		new_match_user = MatchUser.objects.create(user=user)

		username1 = request.data.get('username1')
		if not isinstance(username1, str):
			return Response({"message": "Invalid username1 type."}, status=status.HTTP_400_OK)
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, username1):
			return Response({"error": "Invalid username1 format"}, status=status.HTTP_400_BAD_REQUEST)		

		username2 = request.data.get('username2')
		if not isinstance(username2, str):
			return Response({"message": "Invalid username2 type."}, status=status.HTTP_400_OK)
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, username2):
			return Response({"error": "Invalid username2 format"}, status=status.HTTP_400_BAD_REQUEST)	
		
		colorPlayer1 = request.data.get('colorPlayer1')
		if not colorPlayer1:
			return Response({"error": "No ColorPlayer1 provided"}, status=status.HTTP_400_BAD_REQUEST)
		colorPaddel_regex = r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
		if not re.match(colorPaddel_regex, colorPlayer1):
			return Response({"error": "Invalid colorPlayer1 format"}, status=status.HTTP_400_BAD_REQUEST)
		
		colorPlayer2 = request.data.get('colorPlayer2')
		if not colorPlayer2:
			return Response({"error": "No ColorPlayer2 provided"}, status=status.HTTP_400_BAD_REQUEST)
		colorPaddel_regex = r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
		if not re.match(colorPaddel_regex, colorPlayer2):
			return Response({"error": "Invalid colorPlayer2 format"}, status=status.HTTP_400_BAD_REQUEST)
		
		ALLOWED_POWER_PLAYER = {"Invisible", "Duplication", "Time laps", "Super strength"}
		heroPowerPlayer1 = request.data.get('heroPowerPlayer1')
		if not heroPowerPlayer1:
			return Response({"error": "No heroPowerPlayer1 provided"}, status=status.HTTP_400_BAD_REQUEST)
		if heroPowerPlayer1 not in ALLOWED_POWER_PLAYER:
			return Response({"error": "Invalid format heroPowerPlayer1"}, status=status.HTTP_400_BAD_REQUEST)
		
		heroPowerPlayer2 = request.data.get('heroPowerPlayer2')
		if not heroPowerPlayer2:
			return Response({"error": "No heroPowerPlayer2 provided"}, status=status.HTTP_400_BAD_REQUEST)
		if heroPowerPlayer2 not in ALLOWED_POWER_PLAYER:
			return Response({"error": "Invalid format heroPowerPlayer2"}, status=status.HTTP_400_BAD_REQUEST)
		
		typeOfGame = request.data.get('typeOfGame')
		ALLOWED_TYPE_OF_GAME = {"multiplayer"}
		if not typeOfGame:
			return Response({"error": "No typeOfHame provided"}, status=status.HTTP_400_BAD_REQUEST)		
		if typeOfGame not in ALLOWED_TYPE_OF_GAME:
			return Response({"error": "Invalid format tyeOfGame"}, status=status.HTTP_400_BAD_REQUEST)
		
		ALLOWED_MODE_GAME = {"multiPlayerTwo", "multiPlayerFour", "tournament-multi-local"}
		modeGame = request.data.get('modeGame')
		if not modeGame:
			return Response({"error": "No modeGame provided"}, status=status.HTTP_400_BAD_REQUEST)
		if modeGame not in ALLOWED_MODE_GAME:
			return Response({"error": "Invalid format modeGame"}, status=status.HTTP_400_BAD_REQUEST)
		
		numberPlayers = request.data.get('numberPlayers')
		if not numberPlayers:
			return Response({"error": "No numberPlayers provided"}, status=status.HTTP_400_BAD_REQUEST)
		if (modeGame == "multiPlayerTwo" or modeGame == "multiPlayerFour") and numberPlayers != 2:
			return Response({"error": "Invalid format numberPlayers"}, status=status.HTTP_400_BAD_REQUEST)
		ALLOWED_SIZE_TOURNAMENT = {2, 4, 8, 16, 32}
		if modeGame == "tournament-multi-local" and numberPlayers not in ALLOWED_SIZE_TOURNAMENT:
			return Response({"error": "Invalid format numberPlayers"}, status=status.HTTP_400_BAD_REQUEST)
	
		ALLOWED_SUPERPOWER = {"isSuperPower", "isNotSuperPower"}
		superPower = request.data.get('superPower')
		if not superPower:
			return Response({"error": "No superPower provided"}, status=status.HTTP_400_BAD_REQUEST)
		if superPower not in ALLOWED_SUPERPOWER:
			return Response({"error": "Invalid format superPower"}, status=status.HTTP_400_BAD_REQUEST)
		
		ALLOWED_COURT_COLOR = {"#CF5A30", "#043976", "#0183CB", "#689D63"}
		courtColor = request.data.get('courtColor')
		if not courtColor:
			return Response({"error": "No courtColor provided"}, status=status.HTTP_400_BAD_REQUEST)
		if courtColor not in ALLOWED_COURT_COLOR:
			return Response({"error": "Invalid format courtColor"}, status=status.HTTP_400_BAD_REQUEST)
			
		new_match_user.username1 = username1
		new_match_user.username2 = username2
		new_match_user.colorPlayer1 = colorPlayer1
		new_match_user.colorPlayer2 = colorPlayer2
		new_match_user.heroPowerPlayer1 = heroPowerPlayer1
		new_match_user.heroPowerPlayer2 = heroPowerPlayer2
		new_match_user.typeOfGame = typeOfGame
		new_match_user.numberPlayers = numberPlayers
		new_match_user.modeGame = modeGame
		new_match_user.superPower = superPower
		new_match_user.courtColor = courtColor
		new_match_user.save()
		return Response({"message": "MatchUser create successfull."}, status=status.HTTP_200_OK)
	
class NewRoundTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):

		try:
			user = request.user
			tournament_user = TournamentUser.objects.get(user=user)
			tournament_user.sizeTournament /= 2
			tournament_user.numberMatchPlayed = 0
			tournament_user.tabPlayersNewRound = []
			tournament_user.save()
			return Response({"message": "Tournament New Round modify successfull."}, status=status.HTTP_200_OK)
		
		except tournament_user.ObjectDoesNotExist:
			return Response({"message": "No Tournament found."}, status=status.HTTP_400_BAD_REQUEST)

	
class RemoveTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		try:
			user = request.user
			tournament_user = TournamentUser.objects.get(user=user)
			tournament_user.delete()
			return Response({"message": "Tournament remove successfull."}, status=status.HTTP_200_OK)
		
		except TournamentUser.DoesNotExist:
			return Response({"error": "TournamentUser not found for the current user."}, status=status.HTTP_404_NOT_FOUND)

	
class InsertWinnerInTabNewRoundView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		tournament_user = TournamentUser.objects.get(user=user)
		tabNewRound = request.data.get('tabPlayersNewRound')
		if not tabNewRound:
			return Response({"error": "TabNewRound missing."}, status=status.HTTP_404_NOT_FOUND)
		if not isinstance(tabNewRound, list):
			return Response({"error": "Invalid type tabNewRound."}, status=status.HTTP_404_NOT_FOUND)
		username = tabNewRound[-1][0]
		power = tabNewRound[-1][1]
		colorPaddel = tabNewRound[-1][2]
		if not username:
			return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, username):
			return Response({"error": "No power provided"}, status=status.HTTP_400_BAD_REQUEST)
		ALLOWED_POWER_PLAYER = {"Invisible", "Duplication", "Time laps", "Super strength"}
		if power not in ALLOWED_POWER_PLAYER:
			return Response({"error": "Invalid Power Player."}, status=status.HTTP_404_NOT_FOUND)
		if not colorPaddel:
			return Response({"error": "No Color Paddel provided"}, status=status.HTTP_400_BAD_REQUEST)
		colorPaddel_regex = r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
		if not re.match(colorPaddel_regex, colorPaddel):
			return Response({"error": "Invalid colorPaddel format"}, status=status.HTTP_400_BAD_REQUEST)
		tournament_user.tabPlayersNewRound = tabNewRound
		tournament_user.numberMatchPlayed = tournament_user.numberMatchPlayed + 1
		tournament_user.save()
		return Response({"message": "Tournament insert winner successfull."}, status=status.HTTP_200_OK)
		
class CheckTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		try:
			tournament_user = TournamentUser.objects.get(user=user)
			if not tournament_user.tabPlayers:
				return Response({
                    "message": "No Tournament found."
                }, status=status.HTTP_400_BAD_REQUEST)
			
			return Response({
				"message": "Tournament exists.",
				"tournament": str(tournament_user)
				}, status=status.HTTP_200_OK)
		except TournamentUser.DoesNotExist:
			print(f"No existing TournamentUser for {request.user}")
			return Response({
				"message": "No Tournament found."
			}, status=status.HTTP_404_NOT_FOUND)

class RemoveOnlineListView(APIView):
	permission_classes = [IsAuthenticated]
	
	def put(self, request, *args, **kwargs):
		user = request.user
		OnlinePlayers.objects.filter(user=user).delete()
		user.isConnect = False
		user.save()
		return Response({'detail': 'Déconnexion réussie.'}, status=status.HTTP_200_OK)

class ConnectedUsersView(APIView):
	permission_classes = [IsAuthenticated]  # Accessible uniquement aux utilisateurs authentifiés

	def get(self, request, *args, **kwargs):
		# Récupérer tous les utilisateurs connectés
		connected_users = OnlinePlayers.objects.select_related('user').all()

		data = []
		for player in connected_users:
			profile_photo_url = player.user.profile_photo.url if player.user.profile_photo else None
			if profile_photo_url:
				profile_photo_url = request.build_absolute_uri(profile_photo_url)
				profile_photo_url = profile_photo_url.replace('http://', 'https://')
				profile_photo_url = profile_photo_url.replace('https://localhost', settings.IP_ADDRESS)
			data.append({
				'id': player.user.id,
                'username': player.user.username,
                'isConnect': player.user.is_authenticated,
                'connected_at': player.connected_at,
				'profile-photo': profile_photo_url,
        	})
		return Response({'connected_users': data}, status=200)

class ConnectedFriendsView(APIView):
	permission_classes = [IsAuthenticated]  # Accessible uniquement aux utilisateurs authentifiés

	def get(self, request, *args, **kwargs):
		# Récupérer tous les utilisateurs connectés
		connected_users = OnlinePlayers.objects.select_related('user').all()

		data = []
		for player in connected_users:
            # Récupérer les statistiques de l'utilisateur
			try:
				stats = GameStatsLocal.objects.get(user=player.user)
				stats_serializer = GameStatsLocalSerializer(stats).data
			except GameStatsLocal.DoesNotExist:
				stats_serializer = None

			data.append({
				'id': player.user.id,
                'username': player.user.username,
                'isConnect': player.user.is_authenticated,
                'connected_at': player.connected_at,
                'stats': stats_serializer,  # Inclure les statistiques
        	})
		return Response({'connected_users': data}, status=200)
	
class AddFriendView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		friend_id = request.data.get('id')

		if not friend_id:
			return Response({'error': 'friend_id est requis.'}, status=status.HTTP_400_BAD_REQUEST)
		if not isinstance(friend_id, int):
			return Response({'error': 'Invalid id friend.'}, status=status.HTTP_400_BAD_REQUEST)
		try:
			friend = User.objects.get(id=friend_id)

			if user == friend:
				return Response({'error': 'Vous ne pouvez pas vous ajouter vous-même comme ami.'}, status=status.HTTP_400_BAD_REQUEST)
			if user.friends.filter(id=friend.id).exists():
				return Response({'error': 'Cet utilisateur est déjà votre ami.'}, status=status.HTTP_400_BAD_REQUEST)
			user.add_friend(friend)
			return Response({'message': f'{friend.username} a été ajouté comme ami.'}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({'error': 'Aucun utilisateur trouvé avec cet ID.'}, status=status.HTTP_404_NOT_FOUND)
		
class RemoveFriendView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		friend_id = request.data.get('id')
		
		if not friend_id:
			return Response({'error': 'friend_id est requis.'}, status=status.HTTP_400_BAD_REQUEST)
		if not isinstance(friend_id, int):
			return Response({'error': 'Invalid id friend.'}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			friend = User.objects.get(id=friend_id)

			if user == friend:
				return Response({'error': 'Vous ne pouvez pas vous supprimer vous-même comme ami.'}, status=status.HTTP_400_BAD_REQUEST)
			if not user.friends.filter(id=friend.id).exists():
				return Response({'error': 'Cet utilisateur est pas votre ami.'}, status=status.HTTP_400_BAD_REQUEST)
			user.remove_friend(friend)
			return Response({'message': f'{friend.username} a été supprime de votre liste d amis.'}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({'error': 'Aucun utilisateur trouvé avec cet ID.'}, status=status.HTTP_404_NOT_FOUND)
		

class MatchHistoryUserView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
        
		matches = MatchHistoryUser.objects.filter(user=user)
        
		serializer = MatchHistoryUserSerializer(matches, many=True)
        
		return Response(serializer.data, status=status.HTTP_200_OK)		

	def put(self, request):
		user = request.user

		username1 = request.data.get("username1")
		if not isinstance(username1, str):
			return Response({"message": "Invalid username1 type."}, status=status.HTTP_400_OK)
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, username1):
			return Response({"error": "Invalid username1 format"}, status=status.HTTP_400_BAD_REQUEST)	

		username2 = request.data.get("username2")
		if not isinstance(username2, str):
			return Response({"message": "Invalid username2 type."}, status=status.HTTP_400_OK)
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, username2):
			return Response({"error": "Invalid username2 format"}, status=status.HTTP_400_BAD_REQUEST)
		
		ALLOWED_POWER_PLAYER = {"Invisible", "Duplication", "Time laps", "Super strength"}
		heroPlayer1 = request.data.get("heroPlayer1")
		if not heroPlayer1:
			return Response({"error": "No heroPlayer1 provided"}, status=status.HTTP_400_BAD_REQUEST)
		if heroPlayer1 not in ALLOWED_POWER_PLAYER:
			return Response({"error": "Invalid format heroPlayer1"}, status=status.HTTP_400_BAD_REQUEST)
		
		heroPlayer2 = request.data.get("heroPlayer2")
		if not heroPlayer2:
			return Response({"error": "No heroPlayer2 provided"}, status=status.HTTP_400_BAD_REQUEST)
		if heroPlayer2 not in ALLOWED_POWER_PLAYER:
			return Response({"error": "Invalid format heroPlayer2"}, status=status.HTTP_400_BAD_REQUEST)
		
		numberGameBreaker = request.data.get("numberGameBreaker")
		if numberGameBreaker is None:
			return Response({"error": "No numberGameBreaker provided"}, status=status.HTTP_400_BAD_REQUEST)
		if not isinstance(numberGameBreaker, int):
			return Response({"error": "Invalid format numberGameBreaker"}, status=status.HTTP_400_BAD_REQUEST)
		
		echangeLong = request.data.get("echangeLong")
		if echangeLong is None:
			return Response({"error": "No echangeLong provided"}, status=status.HTTP_400_BAD_REQUEST)
		if not isinstance(echangeLong, int):
			return Response({"error": "Invalid format echangeLong"}, status=status.HTTP_400_BAD_REQUEST)
		
		dureeMatch = request.data.get("dureeMatch")
		if dureeMatch is None:
			return Response({"error": "No dureeMatch provided"}, status=status.HTTP_400_BAD_REQUEST)
		if not isinstance(dureeMatch, int):
			return Response({"error": "Invalid format dureeMatch"}, status=status.HTTP_400_BAD_REQUEST)	
		
		vainqueur = request.data.get("vainqueur")
		if not vainqueur:
			return Response({"error": "No vainqueur provided"}, status=status.HTTP_400_BAD_REQUEST)
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, vainqueur):
			return Response({"error": "Invalid vainqueur format"}, status=status.HTTP_400_BAD_REQUEST)
		
		dates = date.today()
		if not isinstance(dates, date):
			return Response({"error": "Invalid format dates"}, status=status.HTTP_400_BAD_REQUEST)
		
		isSuperPower = request.data.get("isSuperPower")
		if not isSuperPower:
			return Response({"error": "No isSuperPower provided"}, status=status.HTTP_400_BAD_REQUEST)
		ALLOWED_SUPERPOWER = {"isSuperPower", "isNotSuperPower"}
		if isSuperPower not in ALLOWED_SUPERPOWER:
			return Response({"error": "Invalid format isSuperPower"}, status=status.HTTP_400_BAD_REQUEST)
		
		scores = request.data.get("scores")
		if not scores:
			return Response({"error": "No isSuperPower provided"}, status=status.HTTP_400_BAD_REQUEST)
		scores_regex = r'^(0|[1-5])-(0|[1-5])$'
		if not re.match(scores_regex, scores):
			return Response({"error": "Invalid format scores"}, status=status.HTTP_400_BAD_REQUEST)

		MatchHistoryUser.objects.create(
            user=user,
            username1=username1,
            username2=username2,
            heroPlayer1=heroPlayer1,
            heroPlayer2=heroPlayer2,
            numberGameBreaker=numberGameBreaker,
            echangeLong=echangeLong,
            dureeMatch=dureeMatch,
            vainqueur=vainqueur,
            dates=dates,
            isSuperPower=isSuperPower,
			scores=scores
        )
		return Response({"message": "Match créé avec succès."}, status=status.HTTP_201_CREATED)
	
class AddWinnerMatchTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user

		try:
			tournament_user = TournamentUser.objects.get(user=user)
		except tournament_user.ObjectDoesNotExist:
			return Response({"message": "No Tournament found."}, status=status.HTTP_400_BAD_REQUEST)

		tabPlayersNewRound = tournament_user.tabPlayersNewRound

		if len(tabPlayersNewRound) > tournament_user.sizeTournament / 2:
			return Response({"message": "Bad enter tabPlayersNewRound."}, status=status.HTTP_400_BAD_REQUEST)
		
		userWinner = request.data.get('userWinner')
		if not userWinner:
			return Response({"error": "No userWinner provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		username_regex = r'^[a-zA-Z0-9@.+_-]{1,14}$'
		if not re.match(username_regex, userWinner):
			return Response({"error": "Invalid userWinner format"}, status=status.HTTP_400_BAD_REQUEST)	

		found = False
		for player in tournament_user.tabPlayers:
			username = player[0]
			if userWinner == username:
				userWinner = player
				found = True
				break

		if found == False:
			return Response({"error": "Invalid userWinner"}, status=status.HTTP_400_BAD_REQUEST)
		
		tournament_user.numberMatchPlayed += 1
		
		tabPlayersNewRound.append(userWinner)

		tournament_user.save()

		return Response({"message": "Winner added successfully"}, status=status.HTTP_200_OK)