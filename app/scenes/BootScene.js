import TokenService from '../services/TokenService.js';

const labelStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2DAA58'
};

const labelConfig = {
    x: 300,
    y: 100,
    origin: { x: 0.5, y: 0.5 },
    padding: 10,
    text: 'Loading....',
    style: labelStyle
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '18px Arial',
    fill: 'white',
    wordWrap: { width: 200 }
}

function create(config) {
    let game = this;

    this.make.text({
        x: 580,
        y: 0,
        padding: 10,
        text: "Whats Happening?\n\nWe are querying the ethereum network. If this takes a while something might be broken...",
        style: whatsHappeningStyle
    });

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