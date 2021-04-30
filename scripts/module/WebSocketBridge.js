export class WebSocketBridge {
    constructor() {
        this._listeners = {};
    }

    connect() {
        const server = game.settings.get('foundryvtt-characterVignette', 'server-url');

        this.webSocket = new WebSocket(server);
        this.webSocket.addEventListener('open', () => {

        });
        this.webSocket.addEventListener('message', (message) => {
            this._onMessage(message, this._listeners);
        });
    }

    addListener(id, callback) {
        this._listeners[id] = callback;
    }

    send(message) {
        const jsonMessage = JSON.stringify(message);
        this.webSocket.send(jsonMessage);
    }

    _onMessage(message, listeners) {
        const jsonMessage = JSON.parse(message.data);

        if (jsonMessage.messageType && listeners[jsonMessage.messageType])
            listeners[jsonMessage.messageType](jsonMessage);
    }
}