import TokenService from '../services/TokenService.js';

function create(config) {
    let game = this;

    this.add.text(380, 200, 'Loading....');

    TokenService.currentNetwork().then(function(tokenService){
        tokenService.listTokens().then(function(tokens) {
            if (tokens) {
                game.scene.start('crew', {tokens: tokens});
            } else {
                return tokenService.getBalance().then(function(balance){
                    throw "No tokens returned but got balance";
                });
            }
        });
    }).catch(console.alert);
}

const bootScene = {
    key: 'boot',
    active: true,
    init: (config) => {
        console.log('[BOOT] init', config);
    },
    preload: () => {
        console.log('[BOOT] preload');
    },
    create: create,
    update: () => {
        // console.log('[BOOT] update');
    }
};

export default bootScene;