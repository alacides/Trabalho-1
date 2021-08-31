const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:10000');

ws.on('open', function open() {
    ws.send( JSON.stringify ({tipo:'MSG',valor:'conectou'}) );
});

ws.on('message', function incoming(data) {
    var a = JSON.parse(data);
    console.log('recebeu msg',a.data);
});

/// http-server
/// browserify cliente.js -o bundle.js 
//