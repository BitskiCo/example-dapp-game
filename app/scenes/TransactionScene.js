function preload() {
    console.log('[TRANSACTION] preload');
}

const labelStyle = {
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2DAA58'
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '18px Arial',
    fill: 'white',
    wordWrap: { width: 200 }
}

const labelConfig = {
    x: 300,
    y: 300,
    padding: 10,
    origin: {x: 0.5, y: 0.5},
    text: 'Waiting for approval.',
    style: labelStyle
};

function send(method, message, completion) {
    method.send({gas: 7000000})
    .on('transactionHash', function (hash) {
       message.setText('Waiting for first confirmation.');
    })
    .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber >= 24) {
            if (completion) {
                completion(receipt);
            }
        } else {
            message.setText('Got confirmation ' + confirmationNumber + ", waiting for 24.");
        }
    })
    .on('error', function(error){
        message.setText('Error: ' + error);
    });
}

function create(config) {
    let scene = this;

    this.make.text({
        x: 580,
        y: 0,
        padding: 10,
        text: "Whats Happening?\n\nYou've requested a transation on the ethereum network. That transaction needs to be signed by your wallet. Once it is signed it is submitted to the ethereum network where it will either be accepted or rejected.",
        style: whatsHappeningStyle
    });
    
    let message = this.make.text(labelConfig);

    if (config.method) {
        send(config.method, message, config.completion);
    }
}

const transactionScene = {
    key: 'transaction',
    active: false,
    callback: null,
    init: (config) => {
        console.log('[TRANSACTION] init', config);
    },
    preload: preload,
    create: create,
    update: () => {

    }
};

export default transactionScene;