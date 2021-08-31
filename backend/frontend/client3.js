const sendBtn = document.querySelector('#send');
const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');
const UsuarioNome = document.querySelector('#UsuarioNome');
const enviausuario = document.querySelector('#enviausuario');
const ListaUsuarios = document.querySelector('#ListaUsuario')
const convidar = document.querySelector('#Convidar')
const Canvas1 = document.querySelector('#Canvas1')
const center = document.querySelector('#dive')
const palavra = document.querySelector('#palavra')
const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')
const enviar = document.querySelector('#enviar')
const overlay = document.querySelector('#overlay')
const recusar = document.querySelector('#recusar')
const aceitar = document.querySelector('#aceitar')
const opcoes = document.getElementsByClassName('opcao')
const convite = document.querySelector('#convite')
const voltlobby = document.querySelector('#voltarlobby')
const advinhar = document.querySelector('#adivinhar')
const btnadivinhar = document.querySelector('#btnadivinhar')

countderrota = 0
emjogo = 0

function cleanlist(){
    a = ListaUsuarios.length
    for(i=0;i<a;i++){
        console.log(ListaUsuarios.length + 'i: ' + i)
        ListaUsuarios.options[0].remove()
    }
}


function voltarlobby(){
    emjogo = 0
    ListaUsuarios.style.display = 'block'
    convidar.style.display = 'block'
    Canvas1.style.display = 'none'//
    messages.style.display = 'block'
    messages.style.width = '90%'
    messages.style.float = 'right'
    console.log(center)
    //center.style.width = '90%'
    center.style.display = 'block'
    //center.style.justify-content = 'center
    player1.style.display = 'none'
    player2.style.display = 'none'
    palavra.style.display = 'none'
    enviar.style.width = '90%'
    enviar.style.float = 'right'
    console.log(opcoes)
    for(i = 0;i<opcoes.length;i++){
        opcoes[i].style.display = 'none'
    }
    voltlobby.style.display = 'none'
    btnadivinhar.style.display = 'none'
    advinhar.style.display = 'none'
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


function desenharcorpo(c){
    var ctx = c.getContext("2d");
    if(countderrota == 1){
        ctx.moveTo(200,120);
        ctx.arc(180, 120, 20, 0, 2 * Math.PI);
    }
    if(countderrota == 2){
        ctx.moveTo(180,140);
        var x = 180
        var y = 230
        ctx.lineTo(x,y);

    }
    if(countderrota == 3){
        ctx.moveTo(180,230);
        var x = 150
        var y = 260
        ctx.lineTo(x,y);

    }
    if(countderrota == 4){
        ctx.moveTo(180,230);
        var x = 210
        var y = 260
        ctx.lineTo(x,y);

    }
    if(countderrota == 5){
        ctx.moveTo(180,160);
        var x = 210
        var y = 190
        ctx.lineTo(x,y);

    }
    if(countderrota == 6){
        ctx.moveTo(180,160);
        var x = 150
        var y = 190
        ctx.lineTo(x,y);
        showMessage("Sistema: A palavra correta era: " + word)
        for(i=0;i<alfabeto.length;i++){
            opcoes[i].disabled =true
        }
        btnadivinhar.disabled = true
    }
    ctx.stroke();
}




Name = ''
adversario = 'Sem Jogador'
word = ''
Turno = 0
alfabeto = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

function modojogo(){
    emjogo = 1
    countderrota = 0
    ctx = Canvas1.getContext('2d')
    ctx.clearRect(0,0,300,400)
    ctx.beginPath();
    ListaUsuarios.style.display = 'none'
    convidar.style.display = 'none'
    Canvas1.style.display = 'block'
    desenharforca(Canvas1)
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
    console.log(opcoes)
    for(i = 0;i<opcoes.length;i++){
        opcoes[i].style.display = 'unset'
        opcoes[i].disabled = false
    }
    btnadivinhar.disabled = false
    voltlobby.style.display = 'block'
    btnadivinhar.style.display = 'block'
    advinhar.style.display = 'block'
    
    //messageBox.style.width = '50%'
}



let ws;

palavraescondida = []

function revelar(letra){
    charada = ''
    for(i=0;i<word.length;i++){
        if(word[i] == letra){
            palavraescondida[i] = letra
        }
    }
    condition =''
    for(i=0;i<palavraescondida.length;i++){
        condition = condition + palavraescondida[i]
    }
    if(condition == word){
        showMessage('End Game')
    }

    for(i=0;i<palavraescondida.length;i++){
        charada = charada + palavraescondida[i] + ' '
    }
    palavra.textContent = 'Palavra: ' + charada
}

function showMessage(message) {
    messages.textContent += `\n\n${' '+message}`;
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
}

function init() {
    if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
    }

    ws = new WebSocket('ws://localhost:10000');
    ws.onopen = () => {
    console.log('Connection opened!');
    }
    
    ws.onmessage = ({ data }) => 
    {
        data = JSON.parse(data)
        console.log(data.tipo)
        if(data.tipo == 'Attuser'){
            cleanlist()
            desistencia = 1
            console.log('Oi' + data.vetorUsuarios.length)
            for(i=0;i<data.vetorUsuarios.length;i++){
                var opt = document.createElement("option");
                opt.text = data.vetorUsuarios[i]
                ListaUsuarios.options.add(opt)
                if(opt.text == adversario){
                    desistencia = 0
                }
            }
            if(desistencia == 1 && emjogo == 1){
                voltarlobby()
                showMessage("Sistema: Adversario se desconectou.")
            }
            
        }
        if(data.tipo == 'mensagem'){
            showMessage(data.Conteudo);
        }
        if(data.tipo == 'Convite'){
            convite.textContent = data.autor + ": Convidou você para jogar."
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
                        palavraescondida = []
                        for(i=0;i<word.length;i++){
                            palavraescondida.push('_')
                        }
                        modojogo()
                    }
                }
                
            }
        }
        if(data.tipo == 'tentativa'){
            //revelar(data.letra)
            for(i = 0;i<alfabeto.length;i++){
                if(alfabeto[i] == data.letra){
                    opcoes[i].disabled = true
                }
            }
            
            if(data.revelado[1] == 1){
                countderrota = countderrota + 1
                desenharcorpo(Canvas1)
                if(data.palpiteerrado == 1){
                    for(i=countderrota;i<7;i++){
                        countderrota = i
                        desenharcorpo(Canvas1)
                    }
                }
                if(countderrota == 6){
                    //voltlobby.style.display = 'block'

                    if(data.palpiteerrado == 1 && data.turno == '1'){
                        showMessage("Sistema: Partida Finalizada em sua Vitoria devido falha no palpite do oponente, Aperte o botão 'Voltar ao Lobby' para retornar ao lobby")

                    }
                    if(data.palpiteerrado == 1 && data.turno == '0'){
                        showMessage("Sistema: Partida Finalizada com derrota devido a palpite errado, Aperte o botão 'Voltar ao Lobby' para retornar ao lobby")
                    }
                    if(data.palpiteerrado == 0){
                        showMessage("Sistema: Partida Finalizada com derrota para ambos, Aperte o botão 'Voltar ao Lobby' para retornar ao lobby")
                    }
                    
                }
            }
            if(data.revelado[2] == 1){
                //voltlobby.style.display = 'block'

                for(i=0;i<alfabeto.length;i++){
                    opcoes[i].disabled =true
                }
                btnadivinhar.disabled = true
                if(data.turno == '1'){
                    showMessage("Sistema: Partida Finalizada em sua Derrota, Aperte o botão 'Voltar ao Lobby' para retornar ao lobby")
                }
                if(data.turno == '0'){
                    showMessage("Sistema: Partida Finalizada em sua Vitoria, Aperte o botão 'Voltar ao Lobby' para retornar ao lobby")
                }
                
            }
            else{
                if(data.palpiteerrado != 1){
                    if(data.turno == '1'){
                        showMessage("Sistema: Seu Turno.")
                        Turno = 1
                    }
                    if(data.turno == '0'){
                        showMessage("Sistema: Turno do Adversario.")
                    }
                }
                
            }
            palavraescondida = data.revelado[3]
            palavra.textContent = data.revelado[0]
        }
        if(data.tipo == 'desistencia'){
            voltarlobby()
            showMessage("Sistema: Adversario se desconectou.")
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
        texto = Name+': ' + messageBox.value
        msgem = JSON.stringify({tipo:'mensagem',Conteudo:texto})
        ws.send(msgem);
        showMessage(texto);
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
    Turno = 1
    showMessage("Sistema: Jogo Iniciado.")
    showMessage("Sistema: Seu Turno.")
}

recusar.onclick = function(){
    overlay.style.display = 'none'
    console.log('Recusou')
}


btnadivinhar.onclick = () => {
    
    if(Turno == 1){
        adv = advinhar.value
        //guess = JSON.stringify({tipo:'adivinhar',palavra:[adv,word],jogadores:[Name, adversario]})
        adv = adv.toUpperCase()
        guess = JSON.stringify({tipo:'adivinhar',letra:'',palavras:[palavraescondida,word,adv],jogadores:[Name,adversario]})
        ws.send(guess)
        Turno = 0
    }
    else{
        showMessage("Sistema: Não é seu turno.")
    }
    
}


function escolha(){
    choice = JSON.stringify({tipo:'escolha',valor:letra,players:[Name,adversario]})
    console.log(choice)
    ws.send(choice)
}

/*
opcoes[0].onclick = function(){
    if(Turno == 1){
        msg = JSON.stringify({tipo:'tentativa',letra:alfabeto[0],jogadores:[Name,adversario]})
        ws.send(msg)
        Turno = 0
    }
    else{
        showMessage(" Sistema: Não é seu turno.")
    }
}
*/


function tentativa(num){
    if(Turno == 1){
        msg = JSON.stringify({tipo:'tentativa',letra:alfabeto[num],palavras:[palavraescondida,word],jogadores:[Name,adversario]})
        ws.send(msg)
        Turno = 0
    }
    else{
        showMessage("Sistema: Não é seu turno.")
    }
    
}

opcoes[0].onclick = () => {tentativa(0)}
opcoes[1].onclick = () => {tentativa(1)}
opcoes[2].onclick = () => {tentativa(2)}
opcoes[3].onclick = () => {tentativa(3)}
opcoes[4].onclick = () => {tentativa(4)}
opcoes[5].onclick = () => {tentativa(5)}
opcoes[6].onclick = () => {tentativa(6)}
opcoes[7].onclick = () => {tentativa(7)}
opcoes[8].onclick = () => {tentativa(8)}
opcoes[9].onclick = () => {tentativa(9)}
opcoes[10].onclick = () => {tentativa(10)}
opcoes[11].onclick = () => {tentativa(11)}
opcoes[12].onclick = () => {tentativa(12)}
opcoes[13].onclick = () => {tentativa(13)}
opcoes[14].onclick = () => {tentativa(14)}
opcoes[15].onclick = () => {tentativa(15)}
opcoes[16].onclick = () => {tentativa(16)}
opcoes[17].onclick = () => {tentativa(17)}
opcoes[18].onclick = () => {tentativa(18)}
opcoes[19].onclick = () => {tentativa(19)}
opcoes[20].onclick = () => {tentativa(20)}
opcoes[21].onclick = () => {tentativa(21)}
opcoes[22].onclick = () => {tentativa(22)}
opcoes[23].onclick = () => {tentativa(23)}
opcoes[24].onclick = () => {tentativa(24)}
opcoes[25].onclick = () => {tentativa(25)}
voltlobby.onclick = () => {
    voltarlobby()
    msg = JSON.stringify({tipo:'desistencia',jogadores:[Name,adversario]})
    ws.send(msg)
}

/*
opcoes[0].onclick = function(){
    if(Turno == 1){
        msg = JSON.stringify({tipo:'tentativa',letra:alfabeto[0],jogadores:[Name,adversario]})
        ws.send(msg)
        Turno = 0
    }
    else{
        showMessage(" Sistema: Não é seu turno.")
    }
}
*/

init();