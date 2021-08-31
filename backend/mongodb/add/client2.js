console.log('Client-side code running');


const ListaUsuarios = document.querySelector('#ListaUsuario')
const adicionar = document.querySelector('#adicionar')

const remover = document.querySelector('#remover')
adicionar.addEventListener('click', function(e) {
  console.log('button was clicked');
  aaa = JSON.stringify({tipo:'oi'})
  fetch('/clicked', {method: 'post',body: aaa})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

/*
setInterval(function() {
    fetch('/clicks', {method: 'GET'})
      .then(function(response) {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
      })
      .then(function(data) {
          console.log(data)
        document.getElementById('counter').innerHTML = `Button was clicked ${data[0].palavra} times`;
      })
      .catch(function(error) {
        console.log(error);
      });
  }, 4000);
*/

remover.onclick = function() {
  console.log("cliclado")
  fetch('/clicks', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
        console.log(data)
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