from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Assure la connexion à la base de données
        connection.ensure_connection()
        
        # Vérifie si la connexion est utilisable
        if connection.is_usable():
            return JsonResponse({"status": "ok"})
    except:
        # Renvoie une réponse avec un code d'erreur 500 si la connexion échoue
        return JsonResponse({"status": "error"}, status=500)