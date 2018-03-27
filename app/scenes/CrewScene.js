import TokenService from '../services/TokenService.js';

const labelStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#22aa44'
};

const buttonStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#1166aa'
};

const characterPositions = [
    [100, 420],
    [260, 400],
    [580, 400],
    [740, 420],
    [420, 440]
]

function preload() {
    console.log('[CREW] preload');
    this.load.image('character-1', 'assets/character-1.png');
    this.load.image('character-2', 'assets/character-2.png');
    this.load.image('character-3', 'assets/character-3.png');
    this.load.image('character-4', 'assets/character-4.png');
    this.load.image('character-5', 'assets/character-5.png');
}

function over() {
    console.log('button over');
}

function mintToken(pointer) {
    let game = this;
    let tokenService = new TokenService("42"); // Kovan

    game.scene.start('transaction', {
        method: tokenService.mintNewToken(),
        completion: function(receipt) {
            tokenService.list().then(function(tokens){
                game.scene.stop('transaction');
                game.scene.start('crew', { tokens: tokens });
            });  
        }
    });
}

function create(config) {
    let game = this;
    
    let totalTokens = config.tokens.length;
    for (var i = 0; i < totalTokens; i++) {
        let token = config.tokens[i];
        let character = (token % 5) + 1;
        let characterPosition = characterPositions[i];
        let characterImage = this.sys.add.image(characterPosition[0], characterPosition[1], 'character-' + character);

        characterImage.setInteractive();
        characterImage.on('pointerdown', function(pointer) {
            game.scene.stop('crew');
            game.scene.start('unit', { token: token });
        });
    }

    var buttonTitle = '...'

    if (totalTokens === 1) {
        buttonTitle = 'You have 1 guy!';
    } else if (totalTokens < 5) {
        buttonTitle = 'You have ' + totalTokens + ' guys!';
    } else {
        buttonTitle = 'You have a complete crew!';
    }

    // TODO: Show $/Ξ price
    
    let labelConfig = {
        x: 100,
        y: 100,
        padding: 10,
        text: buttonTitle,
        style: labelStyle
    };

    let label = this.sys.make.text(labelConfig);


    if (totalTokens < 5) {
        let buttonConfig = {
            x: 600,
            y: 100,
            padding: 10,
            text: "Get more",
            style: buttonStyle
        };
    
        let button = this.sys.make.text(buttonConfig)
    
        button.setInteractive();
        button.on('pointerdown', mintToken, this);
    }
}

const crewScene = {
    key: 'crew',
    active: false,
    tokens: [],
    init: (config) => {
        console.log('[CREW] init', config);
    },
    preload: preload,
    create: create,
    update: () => {

    }
};

export default crewScene;