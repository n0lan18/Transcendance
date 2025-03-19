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
from myapp import views

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
from myapp.views import Friends
from myapp.views import CreateTournamentView
from myapp.views import NewRoundTournamentView
from myapp.views import RemoveTournamentView
from myapp.views import InsertWinnerInTabNewRoundView
from myapp.views import CheckTournamentView
from myapp.views import RemoveOnlineListView
from myapp.views import ConnectedUsersView
from myapp.views import ConnectedFriendsView
from myapp.views import AddFriendView
from myapp.views import RemoveFriendView
from myapp.views import GameStatsLocalByIdView
from myapp.views import CreateTournamentBasicView
from myapp.views import MatchInfoView
from myapp.views import GameStatsLocalListUpdateView
from myapp.views import MatchHistoryUserView
from myapp.views import AddWinnerMatchTournamentView

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
    path('api/friends/<str:action>/<int:friend_id>/', Friends.as_view(), name='friends_action'),
    path('api/create-tournament/', CreateTournamentView.as_view(), name='create-tournament'),
    path('api/create-tournament-basic/', CreateTournamentBasicView.as_view(), name='create-tournament-basic'),
    path('api/new-round-tournament/', NewRoundTournamentView.as_view(), name='new-round-tournament'),
    path('api/remove-tournament/', RemoveTournamentView.as_view(), name='remove-tournament'),
    path('api/insert-winner-in-tab/', InsertWinnerInTabNewRoundView.as_view(), name='insert-winner-in-tab'),
    path('api/check-tournament/', CheckTournamentView.as_view(), name='check-tournament'),
    path('api/remove-online-list/', RemoveOnlineListView.as_view(), name='remove-online-list'),
    path('api/connected-users/', ConnectedUsersView.as_view(), name='connected-users'),
    path('api/connected-friends/', ConnectedFriendsView.as_view(), name='connect-friends'),
    path('api/add-friend/', AddFriendView.as_view(), name='add-friend'),
    path('api/remove-friend/', RemoveFriendView.as_view(), name='remove-friend'),
    path('api/gamestats-friend/<int:user_id>/', GameStatsLocalByIdView.as_view(), name='gamestats-by-id'),
    path('api/match-user-info/', MatchInfoView.as_view(), name='match-userinfo'),
    path('api/gamestats-update-list/', GameStatsLocalListUpdateView.as_view(), name='gamestats-update-list'),
    path('api/history-games/', MatchHistoryUserView.as_view(), name='match-history'),
    path('api/add-winner-match-tournament/', AddWinnerMatchTournamentView.as_view(), name='add-winner-match-tournament'),
    
    # 42auth
    # path('api/accounts/', include('allauth.urls')), # this will include all the urls provided by django-allauth
	path('api/accounts/profile/', views.profile, name='profile'), # this is the profile page after the user is authenticated
	path('api/', include('myapp.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

