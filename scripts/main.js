import {FoundryCharacterVignette} from "./module/FoundryCharacterVignette.js";

Hooks.once('init', async function() {
    FoundryCharacterVignette.registerSettings(game);

    game.characterVignette = new FoundryCharacterVignette();
});

Hooks.once('ready', async function() {
    game.characterVignette.onReady();
});
