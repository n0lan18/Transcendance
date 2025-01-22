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
import re


from .models import User
from .serializers import UserSerializer
from .models import GameStatsLocal
from .serializers import GameStatsLocalSerializer
from .serializers import FriendSerializer
from .models import TournamentUser
from .serializers import TournamentSerializer
from .models import OnlinePlayers

class RegisterView(APIView):
	permission_classes = [AllowAny]
	def post(self, request, *args, **kwargs):
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			print(request.data)
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
		
		user = authenticate(request, username=usernameOrEmail, password=password)
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
		email = data.get('email', None)
		print('Email: ', email)
		if email:
			if User.objects.filter(email=email).exists():
				return Response({"exists": True, "message": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
			else:
				return Response({"exists": False, "message": "Email does not exist."}, status=status.HTTP_200_OK)
		return Response({"error": "No email provided"}, status=status.HTTP_400_BAD_REQUEST)
			
class CheckUsernameView(APIView):
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		data = request.data.get('data', {})
		username = data.get('username', None)
		print('Username: ', username)
		if username:
			if User.objects.filter(username=username).exists():
				return Response({"exists": True, "message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
			else:
				return Response({"exists": False, "message": "Username does not exist."}, status=status.HTTP_200_OK)
		return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)


class UpdateUsernameView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		username = request.data.get("username")
		print('Username: ', username)
		if username:
			if User.objects.filter(username=username).exists():
				return Response({"exists": True, "message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
			else:
				request.user.username = username
				request.user.save()
				return Response({"message": "Username updated successfully."}, status=status.HTTP_200_OK)
		else:
			return Response({"message": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)

class UpdateIsConnectView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		isConnect = request.data.get("isConnect")
		print("isConnect: ", isConnect)
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
		print('Email: ', email)
		if email:
			if User.objects.filter(email=email).exists():
				return Response({"exists": True, "message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
			else:
				request.user.email = email
				request.user.save()
				return Response({"message": "Email updated successfully."}, status=status.HTTP_200_OK)
		return Response({"error": "No username provided"}, status=status.HTTP_400_BAD_REQUEST)

class UpdatePasswordView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		new_password = request.data.get("password")
		print('Password: ', new_password)
		if new_password:
			user = request.user
			user.set_password(new_password)
			user.save()
			return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
		else:
			return Response({"message": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)

class UpdateImageView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		profile_photo = request.FILES.get('image', None)
		if profile_photo:
			user = request.user
			user.profile_photo = profile_photo
			user.save()
			return Response({"message": "Profile image updated successfully."}, status=status.HTTP_200_OK)
		else:
			return Response({"message": "Image is required."}, status=status.HTTP_400_BAD_REQUEST)

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
				print(pk)
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
		
		tournament_user = TournamentUser.objects.get(user=request.user)
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

		tabPlayers = request.data.get('tabPlayers')
		if not isinstance(tabPlayers, list):
			return Response({'error': 'tabPlayers must be a list'}, status=400)
		shuffle(tabPlayers)
		tabPlayersNewRound = []
		if not isinstance(tabPlayersNewRound, list):
			return Response({'error': 'tabPlayers must be a list'}, status=400)
		numberMatchPlayed = request.data.get('numberMatchPlayed')
		courtColor = request.data.get('courtColor')
		sizeTournament = request.data.get('sizeTournament')
		superPower = request.data.get('superPower')
		
		new_tournament_user.tabPlayers = tabPlayers
		new_tournament_user.tabPlayersNewRound = tabPlayersNewRound
		new_tournament_user.numberMatchPlayed = numberMatchPlayed
		new_tournament_user.courtColor = courtColor
		new_tournament_user.sizeTournament = sizeTournament
		new_tournament_user.superPower = superPower

		print('tournament_user.tabPlayers ', new_tournament_user.tabPlayers)
		print('tournament_user.tabPlayersNewRound ', new_tournament_user.tabPlayersNewRound)
		print('tournament_user.numberMatchPlayed ', new_tournament_user.numberMatchPlayed)
		print('tournament_user.courtColor ', new_tournament_user.courtColor)
		print('tournament_user.sizeTournament ', new_tournament_user.sizeTournament)
		print('tournament_user.superPower ', new_tournament_user.superPower)

		new_tournament_user.save()
		return Response({"message": "Tournament create successfull."}, status=status.HTTP_200_OK)
	
class NewRoundTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):

		user = request.user
		tournament_user = TournamentUser.objects.get(user=user)
		if not isinstance(request.data.get('tabPlayersNewRound'), list):
			return Response({'error': 'tabPlayers must be a list'}, status=400)
		tournament_user.tabPlayers = request.data.get('tabPlayersNewRound')

		tournament_user.sizeTournament /= 2
		tournament_user.numberMatchPlayed = 0
		tournament_user.tabPlayersNewRound = []
		tournament_user.save()
		return Response({"message": "Tournament New Round modify successfull."}, status=status.HTTP_200_OK)
	
class RemoveTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		tournament_user = TournamentUser.objects.get(user=user)
		tournament_user.delete()
		return Response({"message": "Tournament remove successfull."}, status=status.HTTP_200_OK)
	
class InsertWinnerInTabNewRoundView(APIView):
	permission_classes = [IsAuthenticated]

	def put(self, request):
		user = request.user
		tournament_user = TournamentUser.objects.get(user=user)
		tournament_user.tabPlayersNewRound = request.data.get('tabPlayersNewRound')
		tournament_user.numberMatchPlayed = tournament_user.numberMatchPlayed + 1
		tournament_user.save()
		return Response({"message": "Tournament insert winner successfull."}, status=status.HTTP_200_OK)
		
class CheckTournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		try:
			tournament_user = TournamentUser.objects.get(user=user)
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
		
		try:
			friend = User.objects.get(id=friend_id)

			if user == friend:
				return Response({'error': 'Vous ne pouvez pas vous ajouter vous-même comme ami.'}, status=status.HTTP_400_BAD_REQUEST)

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
		
		try:
			friend = User.objects.get(id=friend_id)

			if user == friend:
				return Response({'error': 'Vous ne pouvez pas vous supprimer vous-même comme ami.'}, status=status.HTTP_400_BAD_REQUEST)

			user.remove_friend(friend)
			return Response({'message': f'{friend.username} a été supprime de votre liste d amis.'}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({'error': 'Aucun utilisateur trouvé avec cet ID.'}, status=status.HTTP_404_NOT_FOUND)