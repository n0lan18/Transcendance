from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import asyncio
import json
import logging


logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

class UserStatusConsumer(AsyncWebsocketConsumer):
    @sync_to_async
    def set_user_online(self, user, status):
        user.isConnect = status
        user.save()
        print(f"User {user.username} isConnect status updated to {status}")

    @sync_to_async
    def delete_online_player(self, user):
        from myapp.models import OnlinePlayers
        OnlinePlayers.objects.filter(user=user).delete()

    @sync_to_async
    def add_online_player(self, user):
        from myapp.models import OnlinePlayers
        if not OnlinePlayers.objects.filter(user=user).exists():
            OnlinePlayers.objects.create(user=user)
            print(f"Utilisateur {user} ajouté à la liste des joueurs en ligne.")
        else:
            print(f"Utilisateur {user} est déjà dans la liste des joueurs en ligne.")

    async def connect(self):
        await self.accept()
        await self.send_json({"event": "connected", "message": "Connection successfully established."})
        print("WebSocket connection established ETABLIShED")
         # Vérifiez que l'utilisateur est bien connecté et qu'il existe dans self.scope
        user = self.scope.get('user')
        if user and user.is_authenticated:
            await self.add_online_player(user)
            print(f"Utilisateur {user.username} connecté")
        else:
            print("L'utilisateur n'est pas authentifié.")
            await self.close()
        self.ping_interval = 30  # Intervalle de temps entre les pings (en secondes)
        self.pong_timeout = 10
        self.pong_received = True
        self.ping_task = asyncio.create_task(self.send_ping())


    async def disconnect(self, close_code):
        user = self.scope['user']
        print(user)
        if user.is_authenticated:
            await self.delete_online_player(user)
            print(f"Utilisateur {user} supprimé de la liste des joueurs en ligne.")
            await self.set_user_online(user, False)
            print("WebSocket disconnected")
        
        # Annuler la tâche de ping
        if self.ping_task:
            self.ping_task.cancel()
            print("Ping task annulée")

        await self.close()

    async def send_json(self, data):
        """
        Cette méthode envoie un message JSON au WebSocket.
        """
        await self.send(text_data=json.dumps(data))

    async def send_ping(self):
        """
        Envoie un message ping au client à intervalles réguliers.
        """
        while True:
            await asyncio.sleep(self.ping_interval)
            self.pong_received = False
            # Envoi du ping au client
            await self.send(text_data=json.dumps({"event": "ping"}))
            print("Ping envoyé")

            await asyncio.sleep(self.pong_timeout)
            if not self.pong_received:
                print("Aucun PONG reçu, déconnexion...")
                user = self.scope['user']
                if user.is_authenticated:
                    # Mettre à jour le statut 'isConnect' de l'utilisateur
                    await self.set_user_online(user, False)
                await self.disconnect(close_code=4000)  # Code de fermeture personnalisé
                break


    async def receive(self, text_data):
        from django.contrib.auth import get_user_model

        User = get_user_model()
        """
        Cette méthode est appelée lorsqu'un message JSON est reçu
        depuis le WebSocket.
        """
        content = json.loads(text_data)
        print(content)
        event = content.get("event")
        username = content.get("username")

        if event == "pong":
            print("Réponse pong reçue")
            self.pong_received = True

        elif event == "connect":
            # Connexion de l'utilisateur
            try:
                user = await sync_to_async(User.objects.get)(username=username)

                logger.info(user)
                # Si l'utilisateur est authentifié, on met à jour son statut en ligne
                if user.is_authenticated:
                    await self.set_user_online(user, True)
                    await self.send_json({
                        "status": "success",
                        "message": f"User {user.username} is now online.",
                        "isConnect": user.isConnect
                    })
                else:
                    await self.send_json({
                        "status": "error",
                        "message": "User is not authenticated."
                    })
            except User.DoesNotExist:
                print("NO USER")
                await self.send_json({
                    "status": "error",
                    "message": "User does not exist."
                })

        elif event == "disconnect":
            # Déconnexion de l'utilisateur
            try:
                user = await sync_to_async(User.objects.get)(username=username)

                await self.set_user_online(user, False)
                await self.send_json({
                    "status": "success",
                    "message": f"User {user.username} is now offline.",
                    "isConnect": user.isConnect
                })
            except User.DoesNotExist:
                await self.send_json({
                    "status": "error",
                    "message": "User does not exist."
                })
