import { WebSocketBridge } from "./WebSocketBridge.js";

Hooks.once('init', async function() {
    game.settings.register('websocket-bridge', 'server-url', {
        name: 'Server URL',
        hint: 'The remote socket server to connect to',
        scope: 'world',
        config: true,
        type: String,
        default: 'ws://localhost:44044'
    });
    game.settings.register('websocket-bridge', 'auto-connect', {
        name: 'Automatically connect on startup',
        hint: '',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    game.webSocketBridge = new WebSocketBridge();
});

Hooks.once('ready', async function() {
    if (game.settings.get('websocket-bridge', 'auto-connect'))
        game.webSocketBridge.connect();

    game.webSocketBridge.addListener('showVignette', (message) => {
        console.log(message);
    });
});
