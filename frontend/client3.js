const sendBtn = document.querySelector('#send');
const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');
const UsuarioNome = document.querySelector('#UsuarioNome');
const enviausuario = document.querySelector('#enviausuario');



let ws;
Name = ''

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
    
    ws.onmessage = ({ data }) => showMessage(data);
    ws.onclose = function() {
    ws = null;
    }
}

sendBtn.onclick = function() {
    if (!ws) {
    showMessage("No WebSocket connection :(");
    return ;
    }

    ws.send(JSON.stringify(messageBox.value));
    showMessage(messageBox.value);
}

enviausuario.onclick = function() {
    if (!ws) {
    showMessage("No WebSocket connection :(");
    return ;
    }

    UsuarioNome.style.display = 'none'
    enviausuario.style.display = 'none'
    sendBtn.style.display = 'block'
    messages.style.display = 'block'
    messageBox.style.display ='block'
    //document.getElementById("UsuarioNome").style.display = 'none';
}




init();