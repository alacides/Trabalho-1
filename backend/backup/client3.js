const sendBtn = document.querySelector('#send');
const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');
const UsuarioNome = document.querySelector('#UsuarioNome');
const enviausuario = document.querySelector('#enviausuario');
const ListaUsuarios = document.querySelector('#ListaUsuario')
const convidar = document.querySelector('#Convidar')
const Canvas1 = document.querySelector('#Canvas1')
const Canvas2 = document.querySelector('#Canvas2')
const center = document.querySelector('#dive')
const palavra = document.querySelector('#palavra')
const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')
const enviar = document.querySelector('#enviar')
const overlay = document.querySelector('#overlay')
const recusar = document.querySelector('#recusar')
const aceitar = document.querySelector('#aceitar')

function cleanlist(){
    a = ListaUsuarios.length
    for(i=0;i<a;i++){
        console.log(ListaUsuarios.length + 'i: ' + i)
        ListaUsuarios.options[0].remove()
    }
}


function desenharforca(c){
    var ctx = c.getContext("2d");
    ctx.moveTo(50,50);
    var x = 180
    var y = 50
    ctx.lineTo(x,y);
    ctx.moveTo(50,300);
    var x = 50
    var y = 50
    ctx.lineTo(x,y);
    ctx.moveTo(10,300);
    var x = 250
    var y = 300
    ctx.lineTo(x,y);
    ctx.moveTo(180,50);
    var x = 180
    var y = 100
    ctx.lineTo(x,y);
    ctx.stroke();
}

Name = ''
adversario = 'Sem Jogador'
word = ''

function modojogo(){
    ListaUsuarios.style.display = 'none'
    convidar.style.display = 'none'
    Canvas1.style.display = 'block'
    Canvas2.style.display = 'block'
    desenharforca(Canvas1)
    desenharforca(Canvas2)
    messages.style.width = '50%'
    messages.style.float = 'left'
    console.log(center)
    //center.style.width = '90%'
    center.style.display = 'flex'
    //center.style.justify-content = 'center'
    charada = '_'
    for(i=1;i<word.length;i++){
        charada = charada + ' _'
    }
    palavra.textContent = 'Palavra: ' + charada
    player1.style.display = 'block'
    player2.style.display = 'block'
    palavra.style.display = 'block'
    player1.textContent = Name
    player2.textContent = adversario
    enviar.style.width = '50%'
    enviar.style.float = 'none'
    //messageBox.style.width = '50%'
    

}



let ws;


function showMessage(message) {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
}

function init() {
    if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
    }

    ws = new WebSocket('ws://localhost:6969');
    ws.onopen = () => {
    console.log('Connection opened!');
    }
    
    ws.onmessage = ({ data }) => 
    {
        data = JSON.parse(data)
        console.log(data.tipo)
        if(data.tipo == 'Attuser'){
            cleanlist()
            console.log('Oi' + data.vetorUsuarios.length)
            for(i=0;i<data.vetorUsuarios.length;i++){
                var opt = document.createElement("option");
                opt.text = data.vetorUsuarios[i]
                ListaUsuarios.options.add(opt)
            }
            
        }
        else{
            showMessage(data.Conteudo);
        }
        if(data.tipo == 'Convite'){
            console.log('ativar mensagem')
            overlay.style.display = 'block'
            //opcao = confirm(data.Conteudo)
            adversario = data.autor
            /*if(opcao == true){
                aceitacao = JSON.stringify({tipo:'Aceitacao',jogadores:[data.autor, Name]})
                console.log(aceitacao)
                ws.send(aceitacao)
            }
            else{
                console.log("Recusou")
            }
            */

        }
        if(data.tipo == 'alteracao'){
            if(data.modo == 'jogo'){
                for(i=0;i<2;i++){
                    if(data.jogadores[i] != Name){
                        adversario = data.jogadores[i]
                        console.log(data.palavra)
                        word = data.palavra
                        modojogo()
                    }
                }
                
            }
        }
        
    }
    ws.onclose = function() {
    ws = null;
    }
}

sendBtn.onclick = function() {
    if (!ws) {
    showMessage("No WebSocket connection :(");
    return ;
    }
    if(messageBox.value !=''){
        ws.send(JSON.stringify(messageBox.value));
        showMessage(' ' + Name+': ' + messageBox.value);
    }
}

enviausuario.onclick = function() {
    if (!ws) {
    showMessage("No WebSocket connection :(");
    return ;
    }

    UsuarioNome.style.display = 'none'
    enviausuario.style.display = 'none'
    sendBtn.style.display = 'block'
    ListaUsuarios.style.display = 'block'
    convidar.style.display = 'block'
    messages.style.display = 'block'
    messageBox.style.display ='block'
    //ListaUsuarios.style.display = 'none'
    Name = UsuarioNome.value
    ws.send(JSON.stringify(Name));
    //showMessage(UsuarioNome.value);
}

convidar.onclick = function() {
    if (!ws) {
    showMessage("No WebSocket connection :(");
    return ;
    }

    UsuarioSelecionado = JSON.stringify({tipo:'Convite',convidado: ListaUsuarios.options[ListaUsuarios.selectedIndex].text})
    
    console.log(UsuarioSelecionado)
    ws.send(UsuarioSelecionado);
}

aceitar.onclick = function() {
    aceitacao = JSON.stringify({tipo:'Aceitacao',jogadores:[adversario, Name]})
    console.log(aceitacao)
    ws.send(aceitacao)
    overlay.style.display = 'none'
}

recusar.onclick = function(){
    overlay.style.display = 'none'
    console.log('Recusou')
}


function revelar(letra){
    charada = ''
    palavra.textContent = 'Palavra: ' + charada
    for(i=0;i<word.length;i++){
        if(word[i] == letra){
            charada = charada+ ' ' + letra
        }
        else{
            charada = charada + ' _'
        }
    }
}


function escolha(){
    choice = JSON.stringify({tipo:'escolha',valor:letra,players:[Name,adversario]})
    console.log(choice)
    ws.send(choice)
}

init();