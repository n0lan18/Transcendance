# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet

# Créez un routeur et enregistrez le ViewSet
router = DefaultRouter()
router.register(r'auth', AuthViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
