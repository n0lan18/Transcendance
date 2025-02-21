let gamesocket = null;

export function InitializeGameSocket (roomname)
{
    if (!gamesocket)
        gamesocket = new WebSocket(`wss://localhost:8443/ws/onlinegame/${roomname}/`);
    gamesocket.onopen = () => console.log("Connexion WebSocket réussie !");
    gamesocket.onerror = (error) => console.error("Erreur WebSocket :", error);
    gamesocket.onclose = (event) => {
        console.log(`WebSocket fermée pour la room: ${roomname} | Code: ${event.code} | Raison: ${event.reason}`);
    };
    return (gamesocket);

}

export function CloseSocket()
{
    if (gamesocket)
    {
        gamesocket.close();
        gamesocket = null;
    }
}

export function GetSocket()
{
    return gamesocket;
}