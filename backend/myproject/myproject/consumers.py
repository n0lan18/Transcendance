from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import asyncio
import json
import logging
import redis


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

class OnlineGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs'].get('room_name', None)
        self.username = None

        print(f"self.room_name défini dans connect() : {self.room_name}")

        if not self.room_name:
            print("Erreur : Aucun room_name reçu lors de la connexion WebSocket", flush=True)
            await self.close()
            return

        self.room_group_name = f"game_{self.room_name}"

        self.username = self.room_name.replace("room_", "").replace("_session", "")
        print(f"Username extrait : {self.username} (room_name: {self.room_name})", flush=True)

        if not hasattr(self.channel_layer, "active_channels"):
            self.channel_layer.active_channels = {}

        self.channel_layer.active_channels[self.username] = self.channel_name
        print(f"{self.username} enregistré avec channel_name={self.channel_name}", flush=True)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"Connexion WebSocket : utilisateur={self.username} → room_name={self.room_name} → channel_name={self.channel_name}", flush=True)

        await self.send(text_data=json.dumps({
            'action': 'assign_room',
            'room_name': self.room_name,
        }))

    async def disconnect(self, close_code):
        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)
        active_game_data = redis_client.hget("active_games", self.room_name)
        if active_game_data is None:
            return
        active_game = json.loads(active_game_data)

        player1 = active_game["player1"]
        player2 = active_game["player2"]

        if self.username == player1:
            opponent = player2
        else:
            opponent = player1
 
        opponent_channel = self.channel_layer.active_channels[opponent]
        
        print(f"Envoi de deconnexion au joueur adverse {opponent} par {self.username}", flush=True)
        if opponent_channel:
            print(f"Envoi de deconnexion au joueur adverse {opponent}", flush=True)
            await self.channel_layer.send(
                opponent_channel,
                {
                    'type': 'broadcast_disconnection'
                }
            )
        else:
            print(f"⚠️ [DEBUG] Aucun canal actif trouvé pour l'adversaire {opponent}", flush=True)
        
        if self.room_name:
            print(f"Déconnexion WebSocket pour {self.room_name}. Code de fermeture : {close_code}", flush=True)
            deleted = redis_client.delete(f"rally_{self.room_name}")


            redis_client.hdel("active_games", self.room_name)
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        if hasattr(self, 'room_name'):
            del self.room_name

        await self.close()

    async def receive(self, text_data):
        """
        Cette méthode reçoit les messages envoyés via WebSocket et redirige
        vers la bonne méthode en fonction du type d'action.
        """
        try:
            text_data_json = json.loads(text_data)
            action = text_data_json.get("type")

            if action == "start_search":
                await self.start_search(text_data_json)
            elif action == "stop_search":
                await self.stop_search(text_data_json)
            elif action == "move_paddle":
                await self.move_paddle(text_data_json)
            elif action == "update_ball":
                await self.update_ball(text_data_json)
            elif action == "invisibility":
                await self.invisibility(text_data_json)
            elif action == "timelaps":
                await self.timelaps(text_data_json)
            elif action == "superstrengh":
                await self.superstrengh(text_data_json)
            elif action == "duplication":
                await self.duplication(text_data_json)

        except json.JSONDecodeError:
            print("Erreur : Impossible de décoder le message JSON reçu.", flush=True)
        except Exception as e:
            print(f"Erreur inconnue dans receive : {str(e)}", flush=True)

    async def start_search(self, text_data_json):
        action = text_data_json.get("type")
        player_id = text_data_json['player_id']
        username = text_data_json['username']
        character = text_data_json['character']
        court = text_data_json['court']
        color = text_data_json['color']
        superpower = text_data_json['superpower']

        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)

        try:
            redis_client.ping()  # Vérifie la connexion
            print("Message redis recu.", flush=True)
        except redis.ConnectionError as e:
            print(f"Erreur de message à Redis : {e}", flush=True)
            return

        
        redis_client.rpush("player_queue", json.dumps({
            "player_id": player_id,
            "username": username,
            "character": character,
            "court" : court,
            "color" : color,
            "room_name": self.room_name,
            "superpower": superpower
        }))
        print(f"Joueur ajouté à la file d'attente : {username}", flush=True)

        while redis_client.llen("player_queue") >= 2:
            print("Deux joueurs trouvés dans la file d'attente.", flush=True)
            
            player1 = json.loads(redis_client.lpop("player_queue"))
            player2 = json.loads(redis_client.lpop("player_queue"))
            
            print(f"Joueur 1 extrait : {player1}", flush=True)
            print(f"Joueur 2 extrait : {player2}", flush=True)

            if player1['player_id'] == player2['player_id']:
                redis_client.rpush("player_queue", json.dumps(player1))
                continue
            
            print(f"Match trouvé : {player1['username']} vs {player2['username']}", flush=True)

            room_name = player1['room_name']
            player2['room_name'] = room_name

            player1["role"] = "player1"
            player2["role"] = "player2"

            self.room_name = room_name

            redis_client.hset("active_games", room_name, json.dumps({
                "player1": player1["username"],
                "player2": player2["username"]
            }))
            
            await self.channel_layer.send(
                self.channel_layer.active_channels[player1['username']], 
                {
                    'type': 'match_found',
                    'username': player1['username'],
                    'character': player1['character'],
                    'opponent': player2,
                    'role': "player1",
                    'room_name': room_name,
                    'court': player1['court'],
                    'color': player1['color'],
                    'superpower': player1['superpower']
                }
            )
            await self.channel_layer.send(
                self.channel_layer.active_channels[player2['username']], 
                {
                    'type': 'match_found',
                    'username': player2['username'],
                    'character': player2['character'],
                    'opponent': player1,
                    'role': "player2",
                    'room_name': room_name,
                    'court': player2['court'],
                    'color': player2['color'],
                    'superpower': player2['superpower']
                }
            )

    async def stop_search(self, text_data_json):
        player_id = text_data_json["player_id"]
        username = text_data_json["username"]

        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)

        queue_length = redis_client.llen("player_queue")

        for i in range(queue_length):
            player_data = redis_client.lindex("player_queue", i)
            if player_data:
                    player = json.loads(player_data)
                    if player["player_id"] == player_id:
                        redis_client.lrem("player_queue", 1, player_data)
                        print(f"🗑️ Joueur {username} retiré de la file d'attente.", flush=True)
                        break
        else:
            print(f"Joueur {username} non trouvé dans la file d'attente.", flush=True)

    async def match_found(self, event):
        username = event['username']
        opponent = event['opponent']
        character = event['character']
        role = event['role']
        court = event['court']
        color = event['color']
        superpower = event['superpower']
        room_name = event['room_name']

        print("Match trouvé ! Envoi de :", json.dumps({
            'action': 'match_found',
            'username': username,
            'character': character,
            'court': court,
            'color': color,
            'opponent': opponent,
            'role': role,
            'superpower': superpower,
            'room_name': room_name
        }), flush=True)

        await self.send(text_data=json.dumps({
            'action': 'match_found',
            'username': username,
            'character': character,
            'court': court,
            'color': color,
            'opponent': opponent,
            'role': role,
            'superpower': superpower,
            'room_name': room_name
        }))

    async def move_paddle(self, text_data_json):
        player = text_data_json['player']
        position = text_data_json['position']

        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)
        active_game_data = redis_client.hget("active_games", self.room_name)

        if not active_game_data:
            print(f"Impossible de trouver une partie active pour {self.room_name}", flush=True)
            return

        active_game = json.loads(active_game_data)

        player1 = active_game["player1"]
        player2 = active_game["player2"]

        # Identifier l'adversaire et le canal WebSocket
        if player == "player1":
            opponent = player2
            opponent_role = "player2"
        else:
            opponent = player1
            opponent_role = "player1"

        if opponent not in self.channel_layer.active_channels:
            print(f"Impossible de trouver l'adversaire {opponent} dans active_channels", flush=True)
            return

        opponent_channel = self.channel_layer.active_channels[opponent]
        
        await self.channel_layer.send(
            opponent_channel,
            {
                'type': 'update_paddle',
                'player': player,
                'position': position
            }
        )
    
    async def update_paddle(self, event):
        await self.send(text_data=json.dumps(event))

    async def update_ball(self, data):
        
        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)
        active_game_data = redis_client.hget("active_games", self.room_name)

        if not active_game_data:
            print(f"Impossible de trouver une partie active pour {self.room_name}", flush=True)
            return

        active_game = json.loads(active_game_data)
        current_rally_count = int(redis_client.hget(f"rally_{self.room_name}", "current_rally_count") or 0)
        longest_rally = int(redis_client.hget(f"rally_{self.room_name}", "longest_rally") or 0)

        player1 = active_game["player1"]
        player2 = active_game["player2"]

        if data["player"] == "player1":
            opponent = player2
        else:
            opponent = player1

        if opponent not in self.channel_layer.active_channels:
            print(f"Impossible de trouver l'adversaire {opponent} dans active_channels", flush=True)
            return

        opponent_channel = self.channel_layer.active_channels[opponent]

        print("Message reçu :", data)
        print(f"Envoi update_ball → {opponent} via {opponent_channel}", flush=True)

        if data["collision"] == "collision":
            current_rally_count += 1
            redis_client.hset(f"rally_{self.room_name}", "current_rally_count", current_rally_count)

            if current_rally_count > longest_rally:
                longest_rally = current_rally_count
                redis_client.hset(f"rally_{self.room_name}", "longest_rally", longest_rally)
            print("current_rally_count :", current_rally_count)
                
        elif data["collision"] == "goal":
            current_rally_count = 0
            redis_client.hset(f"rally_{self.room_name}", "current_rally_count", current_rally_count)
            print("current_rally_count to 0 due to goal")

        await self.channel_layer.send(
            opponent_channel,
            {
                "type": "broadcast_ball",
                "rally": current_rally_count,
                "longest_rally": longest_rally,
                "position": data["position"],
                "velocity": data["velocity"],
                "superpowerleft": data["superpowerleft"],
                "superpowerright": data["superpowerright"]
            }
        )

    async def broadcast_ball(self, event):
        await self.send(text_data=json.dumps(event))

    async def broadcast_disconnection(self, event):
        print(f"Deconnexion adverse recue : {event}", flush=True)
        await self.send(text_data=json.dumps(event))
    
    async def invisibility(self, data):
        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)
        active_game_data = redis_client.hget("active_games", self.room_name)

        active_game = json.loads(active_game_data)

        player1 = active_game["player1"]
        player2 = active_game["player2"]

        if data["player"] == "player1":
            opponent = player2
        else:
            opponent = player1

        if opponent not in self.channel_layer.active_channels:
            print(f"Impossible de trouver l'adversaire {opponent} dans active_channels", flush=True)
            return

        opponent_channel = self.channel_layer.active_channels[opponent]

        visibility = data["visibility"]
        trail = data["trail"]
        
        print("Message reçu :", data)
        await self.channel_layer.send(
            opponent_channel,
            {
                "type": "broadcast_invisibility",
                "visibility": visibility,
                "trail": trail
            }
        )
    async def broadcast_invisibility(self, event):
        await self.send(text_data=json.dumps(event))

    async def timelaps(self, data):
        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)
        active_game_data = redis_client.hget("active_games", self.room_name)

        active_game = json.loads(active_game_data)

        player1 = active_game["player1"]
        player2 = active_game["player2"]

        if data["player"] == "player1":
            opponent = player2
        else:
            opponent = player1

        if opponent not in self.channel_layer.active_channels:
            print(f"Impossible de trouver l'adversaire {opponent} dans active_channels", flush=True)
            return

        opponent_channel = self.channel_layer.active_channels[opponent]

        velocity = data["velocity"]

        await self.channel_layer.send(
            opponent_channel,
            {
                "type": "broadcast_timelaps",
                "velocity": velocity
            }
        )
    async def broadcast_timelaps(self, event):
        await self.send(text_data=json.dumps(event))

    async def superstrengh(self, data):
        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)
        active_game_data = redis_client.hget("active_games", self.room_name)

        active_game = json.loads(active_game_data)

        player1 = active_game["player1"]
        player2 = active_game["player2"]

        if data["player"] == "player1":
            opponent = player2
        else:
            opponent = player1

        if opponent not in self.channel_layer.active_channels:
            print(f"Impossible de trouver l'adversaire {opponent} dans active_channels", flush=True)
            return

        opponent_channel = self.channel_layer.active_channels[opponent]

        velocity = data["velocity"]
        
        await self.channel_layer.send(
            opponent_channel,
            {
                "type": "broadcast_superstrengh",
                "velocity": velocity
            }
        )
    async def broadcast_superstrengh(self, event):
        await self.send(text_data=json.dumps(event))

    async def duplication(self, data):
        redis_client = redis.StrictRedis(host='redis', port=6379, decode_responses=True)
        active_game_data = redis_client.hget("active_games", self.room_name)

        active_game = json.loads(active_game_data)

        player1 = active_game["player1"]
        player2 = active_game["player2"]

        if data["player"] == "player1":
            opponent = player2
        else:
            opponent = player1

        if opponent not in self.channel_layer.active_channels:
            print(f"Impossible de trouver l'adversaire {opponent} dans active_channels", flush=True)
            return

        opponent_channel = self.channel_layer.active_channels[opponent]

        velocity = data["velocity"]
        
        print("Message reçu :", data)
        await self.channel_layer.send(
            opponent_channel,
            {
                "type": "broadcast_duplication",
                "velocity": velocity
            }
        )
    async def broadcast_duplication(self, event):
        await self.send(text_data=json.dumps(event))

