from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import get_object_or_404
import re


from .models import User
from .serializers import UserSerializer
from .models import GameStatsLocal
from .serializers import GameStatsLocalSerializer
from .serializers import FriendSerializer

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
		print('EmailUsername: ',usernameOrEmail)
		password = request.data.get('password')
		print('Password: ',password)
		
		user = authenticate(request, username=usernameOrEmail, password=password)
		if user is not None:
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
		print(profile_photo_url, flush=True)

		isConnect = user.isConnect

		friends_data = [
			{
				'username': friend.username,
				'profile_photo': request.build_absolute_uri(friend.profile_photo.url) if friend.profile_photo else None,
				'isConnect': friend.isConnect,
			}
			for friend in user.friends.all()
		]
		return Response({
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
		data = request.data.get('data', {})
		new_password = data.get('password', None)
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