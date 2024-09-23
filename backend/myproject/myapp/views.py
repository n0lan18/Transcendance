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
	permssion_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		return Response({
			'username': user.username,
		})
