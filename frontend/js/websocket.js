let gamesocket = null;

export function InitializeGameSocket(roomname) {
    if (gamesocket && gamesocket.readyState !== WebSocket.CLOSED) {
        return gamesocket;
    }

    const socket = new WebSocket(`ws/onlinegame/${roomname}/`);
    gamesocket = socket;

    return gamesocket;
}

export function CloseSocket() {
    if (gamesocket && gamesocket.readyState === WebSocket.OPEN) {
        gamesocket.close();
    }
    gamesocket = null;
}

export function GetSocket()
{
    return gamesocket;
}

export function closeGameSocket(socket) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "manual_close" }));
        setTimeout(() => {
            CloseSocket(socket);
        }, 500);
    }
}