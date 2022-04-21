let messageList = document.querySelector('#mensajes');
let messageInput = document.querySelector('#inputMensaje');
let usernameInput = document.querySelector('#inputUsername');
let sendButton = document.querySelector('#btnEnviar');

const socket = io("http://localhost:8080"); // Es lo equiparable a nuestro IO del backend

// Socket io clients
socket.on("connection", (data) => {
  console.log("Nuevo cliente conectado");
  socket.emit("nuevo-cliente", data);
});

socket.on("listar-productos", (data) => {
  console.log("Listar productos");
  console.log(data);

    document.querySelector("#productList").innerHTML = "";

  data.forEach((producto) => {
    document.querySelector("#productList").innerHTML += `
        <tr>
            <td>${ producto.title }</td>
            <td>$${ producto.price }</td>
            <td><img class="fotito" src="${ producto.thumbnail }" alt=""></td>
        </tr>
        `;
  });
});

socket.on('mensajes', (data) => {
    console.log("Listar mensajes");
    console.log(data);

    document.querySelector("#mensajes").innerHTML = "";

    data.forEach((mensaje) => {
        document.querySelector("#mensajes").innerHTML += `
            <div class="mensaje">
                <div class="mail">
                <h5>${mensaje.user} - <i> ${mensaje.date} </i> </h5>
                
                </div>
                <div class="texto">
                <p>${mensaje.text}</p>
                </div>
            </div>
            `;
    }
    );
});

// Sockets Mensajes

sendButton.addEventListener('click', () => {
    let message = messageInput.value;
    let username = usernameInput.value;
    if(message.length > 3 && username.length > 2) {
        socket.emit('nuevo-mensaje', {
            user: username,
            text: message,
            date: new Date(Date.now()).toLocaleDateString() + ' ' + new Date(Date.now()).toTimeString().split(' ')[0]
        });
        messageInput.value = '';
    }else{
        alert('Please enter a valid username and message');
    }
});

//fin sockets mensajes


//capturar formulario
const form = document.querySelector("#productForm");

// No recarga la pagina pero agregar / envia los datos por el emit del socket
form.submit = (e) => {
    e.preventDefault();
    const title = document.querySelector("#nombre").value;
    const price = document.querySelector("#precio").value;
    const thumbnail = document.querySelector("#foto").value;
    
    const producto = {
        title,
        price,
        thumbnail,
    };
    
    socket.emit("nuevo-producto", producto);
};
