import {WebSocketBridge} from "./WebSocketBridge.js";
const BABYLON = window.BABYLON;

export class FoundryCharacterVignette {
    constructor() {
        this._webSocketBridge = new WebSocketBridge();
        this._vignettes = new Map();
    }

    static registerSettings(game) {
        game.settings.register('foundryvtt-characterVignette', 'server-url', {
            name: 'Server URL',
            hint: 'The remote socket server to connect to',
            scope: 'world',
            config: true,
            type: String,
            default: 'ws://18.216.33.38:8000/',
            onChange: value => {
                location.reload();
            }
        });
        game.settings.register('foundryvtt-characterVignette', 'auto-connect', {
            name: 'Automatically connect on startup',
            hint: '',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
            onChange: value => {
                location.reload();
            }
        });
        game.settings.register('foundryvtt-characterVignette', 'fadein-speed', {
            name: 'Vignette Fade-in speed',
            hint: '',
            scope: 'world',
            config: true,
            type: Number,
            default: 10
        });
        game.settings.register('foundryvtt-characterVignette', 'fadeout-speed', {
            name: 'Vignette Fade-out speed',
            hint: '',
            scope: 'world',
            config: true,
            type: Number,
            default: 10
        });
        game.settings.register('foundryvtt-characterVignette', 'scale-x', {
            name: 'Vignette Scale X',
            hint: '',
            scope: 'world',
            config: true,
            type: Number,
            default: 0.2
        });
        game.settings.register('foundryvtt-characterVignette', 'scale-y', {
            name: 'Vignette Scale Y',
            hint: '',
            scope: 'world',
            config: true,
            type: Number,
            default: 0.2
        });
    }

    onReady() {
        if (game.settings.get('foundryvtt-characterVignette', 'auto-connect'))
            this._webSocketBridge.connect();

        this._webSocketBridge.addListener('speakingStart', (message) => {
            this._showVignetteForPlayer(message.value);
        });
        this._webSocketBridge.addListener('speakingEnd', (message) => {
            this._hideVignetteForPlayer(message.value);
        });
        this._webSocketBridge.addListener('confirmation', (message) => {

        });
    }

    _getPositionForVignette(name) {
        const pos = game.foundry3d.createUIPosition();

        let index = parseInt(name.split('-')) - 2;
        switch (index) {
            case 0:
                pos.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                pos.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

                pos.top = "20px";
                pos.left = "50px";
                break;
            case 1:
                pos.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                pos.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

                pos.top = "20px";
                pos.left = "-60px";
                break;
            case 2:
                pos.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                pos.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

                pos.left = "20px";
                pos.top = "-40px";
                break;
            case 3:
                pos.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                pos.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

                pos.left = "-60px";
                pos.top = "-40px";
                break;
            case 4:
                pos.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                pos.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                break;
        }

        return pos;
    }

    _showVignetteForPlayer(character_name) {
        let actor = game.actors.find(actor => character_name.includes(actor.name));
        if (!actor) return;

        let pos = this._getPositionForVignette(character_name);
        const vignette = game.foundry3d.addPlane2D("transparent", "white", pos);

        pos.scaleX = game.settings.get('foundryvtt-characterVignette', 'scale-x');
        pos.scaleY = game.settings.get('foundryvtt-characterVignette', 'scale-y');

        game.foundry3d.addImage2D(actor.img, undefined, pos, vignette);
        game.foundry3d.fadeIn2DElement(vignette, game.settings.get('foundryvtt-characterVignette', 'fadein-speed'));

        this._vignettes.set(character_name, vignette);
    }

    _hideVignetteForPlayer(character_name) {
        if (!this._vignettes.has(character_name) || !this._vignettes.get(character_name))
            return;

        const vignette = this._vignettes.get(character_name);
        game.foundry3d.fadeOut2DElement(vignette, game.settings.get('foundryvtt-characterVignette', 'fadeout-speed'));

        this._vignettes.delete(character_name);
    }
}