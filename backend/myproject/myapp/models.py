from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField


class User(AbstractUser):
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    isConnect = models.BooleanField(default=False)
    pass

User = get_user_model()

class GameStatsLocal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="game_stats")
    scores = ArrayField(models.CharField(max_length=50), default=list)
    resultats = ArrayField(models.CharField(max_length=10), default=list)
    numberSimpleMatch = models.IntegerField(default=0)
    numberVictorySimpleMatch = models.IntegerField(default=0)
    numberTournament = models.IntegerField(default=0)
    numberMatchTournament = models.IntegerField(default=0)
    numberVictoryMatchTournament = models.IntegerField(default=0)
    numberVictoryTournament = models.IntegerField(default=0)
    heroInvisible = models.IntegerField(default=0)
    heroDuplication = models.IntegerField(default=0)
    heroSuperstrength = models.IntegerField(default=0)
    heroTimelaps = models.IntegerField(default=0)
    numberGoalsWin = models.IntegerField(default=0)
    numberGoalLose = models.IntegerField(default=0) 
    bestResultTournament = models.IntegerField(default=64)


