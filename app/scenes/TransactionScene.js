function preload() {
    console.log('[TRANSACTION] preload');
}

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