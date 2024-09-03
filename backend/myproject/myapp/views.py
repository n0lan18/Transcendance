from django.shortcuts import render

from rest_framework import viewsets
from .models import Auth
from .serializers import AuthSerializer

class AuthViewSet(viewsets.ModelViewSet):
    queryset = Auth.objects.all()
    serializer_class = AuthSerializer