import { getUserInfo } from "./utils.js";

export async function newWebSocket()
{
    let userInfo = await getUserInfo();  

    const roomname = `${userInfo.username}_session`;

    const socket = new WebSocket(`wss://localhost:8443/ws/game/${roomname}/`);
    const url = `wss://localhost:8443/ws/game/${roomname}/`;

    socket.onopen = () => console.log("Connexion WebSocket établie");
    socket.onerror = (error) => console.error("Erreur WebSocket : ", error);
    socket.onclose = () => console.log("Connexion WebSocket fermée");
}