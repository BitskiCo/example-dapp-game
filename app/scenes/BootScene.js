import TokenService from '../services/TokenService.js';

const labelStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#22aa44'
};

const labelConfig = {
    x: 100,
    y: 100,
    padding: 10,
    text: 'Loading....',
    style: labelStyle
};

function create(config) {
    let game = this;

    this.make.text(labelConfig);

    TokenService.currentNetwork().then(function(tokenService ){
        tokenService.list().then(function(tokens) {
            if (tokens) {
                game.scene.start('crew', {tokenService: tokenService, tokens: tokens});
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