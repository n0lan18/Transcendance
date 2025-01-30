from rest_framework import serializers
from .models import User, GameStatsLocal, TournamentUser, MatchUser, MatchHistoryUser
from pathlib import os
from django.conf import settings
import random

class GameStatsLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameStatsLocal
        fields = ['user', 'scores', 'resultats', 'dates', 'numberSimpleMatch', 'numberVictorySimpleMatch', 'numberTournament', 'numberMatchTournament', 'numberVictoryMatchTournament', 'numberVictoryTournament', 'heroInvisible', 'heroDuplication', 'heroSuperstrength', 'heroTimelaps', 'numberGoalsWin', 'numberGoalLose', 'bestResultTournament']
        read_only_fields = ['user']

class FriendSerializer(serializers.ModelSerializer):
    isConnect: serializers.BooleanField(source='isConnect')
    game_stats = GameStatsLocalSerializer(source='game_stats.first', read_only=True)

    class Meta:
        model = User
        fields = ['username', 'isConnect', 'game_stats']

class UserSerializer(serializers.ModelSerializer):
    friends = FriendSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile_photo', 'isConnect', 'friends', 'match_history']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        # Utilise set_password pour hacher le mot de passe
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])  # Hachage du mot de passe

        random_integer = random.randint(1, 10)
        imageSrc = "photo-profile" + str(random_integer) + ".png"
        default_photo_path = os.path.join(settings.MEDIA_ROOT, 'profile_photos', imageSrc)
        if os.path.exists(default_photo_path):
            with open(default_photo_path, 'rb') as file:
                user.profile_photo.save(imageSrc, file)
        else:
            set_default_profile_photo(user)
        user.save()

        game_stats = GameStatsLocal(user=user)
        # Initialisez les autres champs de GameStatsLocal
        game_stats.scores = []  # Si vous souhaitez une liste vide au début
        game_stats.resultats = []  # Si vous souhaitez une liste vide au début
        game_stats.numberSimpleMatch = 0
        game_stats.numberVictorySimpleMatch = 0
        game_stats.numberTournament = 0
        game_stats.numberMatchTournament = 0
        game_stats.numberVictoryMatchTournament = 0
        game_stats.numberVictoryTournament = 0
        game_stats.heroInvisible = 0
        game_stats.heroDuplication = 0
        game_stats.heroSuperstrength = 0
        game_stats.heroTimelaps = 0
        game_stats.numberGoalsWin = 0
        game_stats.numberGoalLose = 0
        game_stats.bestResultTournament = 64        
        game_stats.save()
        return user


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentUser
        fields = ['user', 'tabPlayers', 'tabPlayersNewRound', 'numberMatchPlayed', 'courtColor', 'sizeTournament', 'superPower']
        read_only_fields = ['user']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchUser
        fields = '__all__'

class MatchHistoryUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistoryUser
        fields = '__all__'