import jwt
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class TokenAuthMiddleware(BaseMiddleware):
    """
    Middleware personnalisé pour l'authentification via token JWT.
    """
    async def __call__(self, scope, receive, send):
        from django.contrib.auth.models import AnonymousUser  # Importation retardée
        from django.contrib.auth import get_user_model

        scope["user"] = AnonymousUser()
        token = None
        query_string = scope.get('query_string', b'').decode()

        # Récupération du token JWT à partir de l'URL
        for param in query_string.split('&'):
            if param.startswith("token="):
                token = param.split('=')[1]

        if token:
            try:
                # Décodage du token JWT
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user = await self.get_user_from_payload(payload)
                if user is not None:
                    scope['user'] = user
                else:
                    scope['user'] = AnonymousUser()
                    logger.warning("L'utilisateur n'existe pas dans la base de données.")
            except jwt.ExpiredSignatureError:
                logger.error("Token expiré.")
                scope['user'] = AnonymousUser()
            except jwt.DecodeError:
                logger.error("Erreur de décodage du token.")
                scope['user'] = AnonymousUser()
            except Exception as e:
                logger.error(f"Erreur inconnue lors du traitement du token: {str(e)}")
                scope['user'] = AnonymousUser()

        # Appel du middleware suivant
        await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user_from_payload(self, payload):
        from django.contrib.auth import get_user_model
        try:
            user = get_user_model().objects.get(id=payload['user_id'])
            return user
        except get_user_model().DoesNotExist:
            return None