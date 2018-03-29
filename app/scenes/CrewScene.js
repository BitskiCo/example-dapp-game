import TokenService from '../services/TokenService.js';

const labelStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2DAA58'
};

const buttonStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2B67AB'
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '18px Arial',
    fill: 'white',
    wordWrap: { width: 200 }
}

const characterPositions = [
    [100, 320],
    [260, 300],
    [420, 340],
    [180, 460],
    [340, 460],
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

    this.make.text({
        x: 580,
        y: 0,
        padding: 10,
        text: "Whats Happening?\n\nWe've queried the ethereum network for any ERC721 tokens that are available from our contract. For earch token we calculate an appearance and show that here.\n\nIf you don't have any tokens we let you 'mint' up to five tokens.\n\nIf you do have a token you should see it here. That means our contract worked!",
        style: whatsHappeningStyle
    });
    
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
        x: 300,
        y: 100,
        origin: { x: 0.5, y: 0.5 },
        padding: 10,
        text: buttonTitle,
        style: labelStyle
    };

    let label = this.sys.make.text(labelConfig);


    if (totalTokens < 5) {
        let buttonConfig = {
            x: 690,
            y: 500,
            padding: 10,
            origin: { x: 0.5, y: 0.5 },
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