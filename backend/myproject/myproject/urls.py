"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# myproject/urls.py
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from myapp.views import LoginView
from myapp.views import RegisterView
from myapp.views import UserInfoView
from myapp.views import CheckEmailView
from myapp.views import CheckUsernameView
from myapp.views import GameStatsLocalListCreateView
from myapp.views import GameStatsLocalDetailView
from myapp.views import UpdateUsernameView
from myapp.views import UpdateImageView
from myapp.views import UpdatePasswordView
from myapp.views import UpdateEmailView
from myapp.views import UpdateIsConnectView

urlpatterns = [ 
    path('api/admin/', admin.site.urls),
	path('api/auth/', include('rest_framework.urls')),
	path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('api/register/', RegisterView.as_view(), name='register'),
	path('api/login/', LoginView.as_view(), name='login'),
	path('api/userinfo/', UserInfoView.as_view(), name='userinfo'),
	path('api/check-email/', CheckEmailView.as_view(), name="check-email"),
	path('api/check-username/', CheckUsernameView.as_view(), name="check-username"),
    path('api/update-username/', UpdateUsernameView.as_view(), name='update-username'),
    path('api/update-password/', UpdatePasswordView.as_view(), name='update-password'),
    path('api/update-image/', UpdateImageView.as_view(), name='update-image'),
    path('api/update-email/', UpdateEmailView.as_view(), name='update-email'),
    path('api/gamestats/', GameStatsLocalListCreateView.as_view(), name='gamestats-list-create'),
    path('api/gamestats/<int:pk>/', GameStatsLocalDetailView.as_view(), name='gamestats-detail'),
    path('api/update-isconnect/', UpdateIsConnectView.as_view(), name='update-isconnect'),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

