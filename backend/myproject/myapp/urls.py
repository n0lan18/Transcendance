# myapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet

# Créez un routeur et enregistrez le ViewSet
router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
