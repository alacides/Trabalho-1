const ListaUsuarios = document.querySelector('#ListaUsuario')
const adicionar = document.querySelector('#adicionar')
const remover = document.querySelector('#remover')
const messageBox = document.querySelector('#messageBox')


function cleanlist(){
    a = ListaUsuarios.length
    for(i=0;i<a;i++){
        //console.log(ListaUsuarios.length + 'i: ' + i)
        ListaUsuarios.options[0].remove()
    }
}

function updatepalavras(){
    fetch('/clicks', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
        //console.log(data)
        cleanlist()
      for(i=0;i<data.length;i++){
          var opt = document.createElement("option");
          opt.text = data[i].palavra
          ListaUsuarios.options.add(opt)
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

/*
function insere(){
    fetch('/clicks', {method: 'POST',body:{top:"asadasdas"}})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
        //console.log(data)
        cleanlist()
      document.getElementById('counter').innerHTML = `Button was clicked ${data[0].palavra} times`;
      for(i=0;i<data.length;i++){
          var opt = document.createElement("option");
          opt.text = data[i].palavra
          ListaUsuarios.options.add(opt)
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}
*/


remover.onclick = () =>  {

    a = ListaUsuarios.options[ListaUsuarios.selectedIndex].text
    console.log(a)
    window.location = "http://localhost:4000/add/remove/" + a;
}

adicionar.onclick = () =>  {
    a = messageBox.value
    if(a != ''){
        console.log(a)
        window.location = "http://localhost:4000/add/adicionar/" + a;
    }
}

updatepalavras()

//setInterval(function() {updatepalavras()}, 1000);