const express = require('express')
const http = require('http')
const WebSocket = require('ws')
var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017' 


var app = express();
var server2 = app.listen(8000);
app.set({
     'Content-Type': 'text/html'
});
app.use(express.static(__dirname + '/frontend'));



var app2 = express();
var server2 = app2.listen(4000);
app2.use(express.static(__dirname + '/mongodb'));
const port = 10000
const server = http.createServer(express);
const wss = new WebSocket.Server({server})
num_people = 0


async function listapalavras() {
    let db = await MongoClient.connect(url);
    let dbo = db.db("Trabalho1");
    return await dbo.collection("palavras").find({}, { tipo: 'palavra'}).toArray()
    
}

async function inserepalavra(texto){
    let db = await MongoClient.connect(url);
    let dbo = db.db("Trabalho1");
    plv = {tipo:'palavra',palavra:texto}
    return await dbo.collection("palavras").insertOne(plv)
}

async function deletarpalavra(texto){
    let db = await MongoClient.connect(url);
    let dbo = db.db("Trabalho1");
    var myquery = { palavra: texto };
    return await dbo.collection("palavras").deleteOne(myquery)
}

function revelar(letra,palavraescondida,word){
    charada = ''
    vitoria = 0
    erro = 1
    for(i=0;i<word.length;i++){
        if(word[i] == letra){
            palavraescondida[i] = letra
            erro = 0
        }
    }
    condition =''
    for(i=0;i<palavraescondida.length;i++){
        condition = condition + palavraescondida[i]
    }
    if(condition == word){
        vitoria = 1
    }

    for(i=0;i<palavraescondida.length;i++){
        charada = charada + palavraescondida[i] + ' '
    }
    texto = 'Palavra: ' + charada
    vetor = [texto,erro,vitoria,palavraescondida]
    return vetor
}

wss.on('connection', function connection(ws){
    //Usuarios.push(ws)
    ws.id = 'User'+num_people
    //ws.send(ws.id)
    num_people = num_people+1
    ws.onmessage = ({data}) => {
    
        data = JSON.parse(data)
        console.log(data)
        if(data.tipo == 'Convite'){
            wss.clients.forEach(function each(client){
                if(client.id == data.convidado && ws.id != data.convidado){
                    aa = ws.id + ': convidou voce para jogar'
                    vs = JSON.stringify({tipo: 'Convite',Conteudo: aa,autor: ws.id})
                    client.send(vs)
                }
            })
        }
        if(data.tipo == 'Aceitacao'){
            listapalavras().then(palavras => {
                min = Math.ceil(0);
                max = Math.floor(palavras.length);
                escolha = Math.floor(Math.random() * (max - min)) + min;
                console.log(palavras[escolha].palavra + ' isso que foi mandado')
                plvaleatoria = palavras[escolha].palavra
                palavraagora = plvaleatoria
                wss.clients.forEach(function each(client){
                if(client.id == data.jogadores[0]){
                    alteracao = JSON.stringify({tipo:'alteracao',modo:'jogo',jogadores:data.jogadores,palavra: palavraagora})
                    console.log(alteracao + '   ' + client.id)
                    client.send(alteracao)
                }
                if(client.id == data.jogadores[1]){
                    alteracao = JSON.stringify({tipo:'alteracao',modo:'jogo',jogadores:data.jogadores,palavra: palavraagora})
                    console.log(alteracao + '   ' + client.id)
                    client.send(alteracao)
                }
            })
            })
            
        }
        if(data.tipo == 'tentativa'){
            revelado = revelar(data.letra,data.palavras[0],data.palavras[1])
            wss.clients.forEach(function each(client){
                if(client.id == data.jogadores[0]){
                    alteracao = JSON.stringify({tipo:'tentativa',letra: data.letra ,jogadores:data.jogadores,turno:0,revelado: revelado})
                    console.log(alteracao + '   ' + client.id)
                    client.send(alteracao)
                }
                if(client.id == data.jogadores[1]){
                    alteracao = JSON.stringify({tipo:'tentativa',letra: data.letra ,jogadores:data.jogadores,turno:1,revelado: revelado})
                    console.log(alteracao + '   ' + client.id)
                    client.send(alteracao)
                }
            })
        }
        if(data.tipo == 'adivinhar'){
            revelado = revelar(data.letra,data.palavras[0],data.palavras[1])
            if(data.palavras[2] == data.palavras[1]){
                //adivnhar certo
                vet = []
                for(i=0;i<data.palavras[1].length;i++){
                    vet.push(data.palavras[1][i])
                }
                frase = "Palavra: "
                for(i=0;i<vet.length;i++){
                    frase = frase + vet[i] + ' '
                }

                revelado = [frase,0,1,vet]
                wss.clients.forEach(function each(client){
                    if(client.id == data.jogadores[0]){
                        alteracao = JSON.stringify({tipo:'tentativa',letra: data.letra ,jogadores:data.jogadores,turno:0,revelado: revelado})
                        console.log(alteracao + '   ' + client.id)
                        client.send(alteracao)
                    }
                    if(client.id == data.jogadores[1]){
                        alteracao = JSON.stringify({tipo:'tentativa',letra: data.letra ,jogadores:data.jogadores,turno:1,revelado: revelado})
                        console.log(alteracao + '   ' + client.id)
                        client.send(alteracao)
                    }
                })
    
            }
            else{
                //errado?
                wss.clients.forEach(function each(client){
                    if(client.id == data.jogadores[0]){
                        alteracao = JSON.stringify({tipo:'tentativa',letra: data.letra ,jogadores:data.jogadores,turno:0,revelado: revelado,palpiteerrado:1})
                        console.log(alteracao + '   ' + client.id)
                        client.send(alteracao)
                    }
                    if(client.id == data.jogadores[1]){
                        alteracao = JSON.stringify({tipo:'tentativa',letra: data.letra ,jogadores:data.jogadores,turno:1,revelado: revelado,palpiteerrado:1})
                        console.log(alteracao + '   ' + client.id)
                        client.send(alteracao)
                    }
                })

            }
            
        }
        if(data.tipo == 'mensagem'){
            wss.clients.forEach(function each (client) {
                if(client != ws && client.readyState == WebSocket.OPEN){
                    
                    vs = JSON.stringify({tipo: 'mensagem',Conteudo: data.Conteudo})
                    client.send(vs)
                    console.log(vs)
                }
            })
        }
        if(data.tipo == 'desistencia'){
            wss.clients.forEach(function each(client){
                if(client.id == data.jogadores[1]){
                    msg = JSON.stringify({tipo:'desistencia'})
                    client.send(msg)
                }
            })
        }
    }





    ws.once('message', function incoming(data){
        trigger = 1
        ws.id = JSON.parse(data)
        Usuarios = []
        wss.clients.forEach(function each (client){
            Usuarios.push(client.id)
        })
        console.log(Usuarios)
        wss.clients.forEach(function each (client) {
            atualizador = JSON.stringify({tipo: 'Attuser', vetorUsuarios: Usuarios})
            client.send(atualizador)
            console.log(atualizador)
        })
    })

    ws.on('close', function connection(ws){
        Usuarios = []
        wss.clients.forEach(function each (client){
            Usuarios.push(client.id)
        })
        console.log(Usuarios)
        wss.clients.forEach(function each (client) {
            atualizador = JSON.stringify({tipo: 'Attuser', vetorUsuarios: Usuarios})
            client.send(atualizador)
            console.log(atualizador)
        })
    })
})



server.listen(port, function connection(ws){
    console.log(`Server listening on ${port}`)
})


app2.post('/clicked', (req, res) => {
    const click = {clickTime: new Date()}
    console.log(click)
    console.log(req.body)
    
    //inserepalavra().then(palavra => {
        res.send(201)
    //})
})


app2.get('/add/remove/:rem', (req, res) => {
    console.log("Palavra a ser excluida: "+req.params.rem)
    deletarpalavra(req.params.rem)
    res.statusCode = 302;
    res.setHeader("Location", "http://localhost:4000/add");
    res.end();
});

app2.get('/add/adicionar/:add', (req, res) => {
    console.log("Palavra a ser adicionada: " + req.params.add)
    plvtoupper = req.params.add.toUpperCase()
    inserepalavra(plvtoupper)
    res.statusCode = 302;
    res.setHeader("Location", "http://localhost:4000/add");
    res.end();
});


app2.get('/clicks', (req, res) => {
    listapalavras().then(palavras => {
        
        res.send(palavras);
    })
    
});