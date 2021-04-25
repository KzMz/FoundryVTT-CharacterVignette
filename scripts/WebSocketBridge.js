export class WebSocketBridge {
    constructor() {
        this._listeners = {};
    }

    connect() {
        const server = game.settings.get('websocket-bridge', 'server-url');

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

        if (jsonMessage.type && listeners[jsonMessage.type])
            listeners[message.type](message);
    }
}