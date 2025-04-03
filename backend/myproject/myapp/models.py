from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.utils.timezone import now
from datetime import date


class User(AbstractUser):
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    isConnect = models.BooleanField(default=False)
    friends = models.ManyToManyField("self", related_name='user_friends', blank=True, symmetrical=False)
    match_history = ArrayField(models.JSONField(), default=list)

    def add_friend(self, friend):
        if friend != self and not self.is_friend(friend):
            self.friends.add(friend)
            friend.friends.add(self)
    
    def remove_friend(self, friend):
        if self.is_friend(friend):
            self.friends.remove(friend)
            friend.friends.remove(self)


    def is_friend(self, user):
        return self.friends.filter(id=user.id).exists()

User = get_user_model()

class GameStatsLocal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="game_stats")
    scores = ArrayField(models.CharField(max_length=50), default=list)
    resultats = ArrayField(models.CharField(max_length=10), default=list)
    dates = ArrayField(models.DateField(default=date.today), blank=True, default=list)
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


class TournamentUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tournament_user")
    tabPlayers = models.JSONField(default=list)
    tabPlayersNewRound = models.JSONField(default=list)
    numberMatchPlayed = models.IntegerField(default=0)
    courtColor = models.CharField(max_length=8, default="0xCF5A30")
    sizeTournament = models.IntegerField(default=0)
    superPower = models.CharField(max_length=20, default="isSuperPower")

class OnlinePlayers(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    connected_at = models.DateTimeField(default=now)

class MatchUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="match_user")
    username1 = models.CharField(max_length=20, default="Player1")
    username2 = models.CharField(max_length=20, default="Player2")
    colorPlayer1 = models.CharField(max_length=8, default="#E23F22")
    colorPlayer2 = models.CharField(max_length=8, default="#3BB323")
    heroPowerPlayer1 = models.CharField(max_length=20, default="Invisible")
    heroPowerPlayer2 = models.CharField(max_length=20, default="Super strength")
    typeOfGame = models.CharField(max_length=20, default="multiplayer")
    numberPlayers = models.IntegerField(default=0)
    modeGame = models.CharField(max_length=40, default="multiPlayerTwo")
    superPower = models.CharField(max_length=20, default="isSuperPower")
    courtColor = models.CharField(max_length=8, default="0xCF5A30")

class MatchHistoryUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="match_history_user")
    username1 = models.CharField(max_length=20, default="Player1")
    username2 = models.CharField(max_length=20, default="Player2")
    heroPlayer1 = models.CharField(max_length=20, default="Invisible")
    heroPlayer2 = models.CharField(max_length=20, default="Super strength")
    numberGameBreaker = models.IntegerField(default=0)
    echangeLong = models.IntegerField(default=0)
    dureeMatch = models.FloatField(default=0.0)
    vainqueur = models.CharField(max_length=20, default="Player1")
    dates = models.DateField(default=date.today)
    isSuperPower = models.CharField(max_length=20, default="isSuperPower")
    scores = models.CharField(max_length=50, default="0-0")
    