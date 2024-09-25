from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer

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
		return Response({
			'username': user.username,
		})

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