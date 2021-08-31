const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 10000 },function (){
	console.log('rodando');
});

wss.on('connection', function connection(ws) {

    console.log('Cliente conectou')

    ws.on('message', function incoming(message) {

        var a = JSON.parse(message);
        switch (a.tipo){
            case 'localizacao':
                console.log(a.dados)
                break;
            case 'MSG':
                console.log('mensagem info recebida: ');
                ws.send(JSON.stringify({tipo:'Is',data:'Oi'}))
                break;
            case 'login':
                console.log('mensagem login recebida: '+a.dados.id +'  '+a.dados.passwd);

                break;
        }

    });
});