import { getUserInfo } from "./utils.js";

export async function newWebSocket()
{
    let userInfo = await getUserInfo();  
    console.log("Informations de l'utilisateur :", userInfo);  // Affiche l'objet userInfo dans la console

    const roomname = `${userInfo.username}_session`;
    console.log("Nom de la salle :", roomname);  // Affiche le nom de la salle

    const socket = new WebSocket(`wss://localhost:8443/ws/game/${roomname}/`);
    const url = `wss://localhost:8443/ws/game/${roomname}/`;
    console.log(`Connecting to WebSocket URL: ${url}`);
    console.log("Connexion WebSocket initialisée pour la salle :", roomname);  // Affiche un message lors de l'initialisation de la WebSocket

    socket.onopen = () => console.log("Connexion WebSocket établie");
    socket.onerror = (error) => console.error("Erreur WebSocket : ", error);
    socket.onclose = () => console.log("Connexion WebSocket fermée");
}