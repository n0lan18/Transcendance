from django.urls import path
from . import views

urlpatterns = [
    path('accounts/42/login/', views.login_42, name='login_42'),
    path('accounts/42/login/callback/', views.callback_42, name='callback_42'),
]