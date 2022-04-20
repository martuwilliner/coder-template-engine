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
                    <p> ${mensaje.mail} </p>
                </div>
                <div class="texto">
                    <p>${ mensaje.texto }</p>
                </div>
            </div>
            `;
    }
    );
});

const formMensaje = document.querySelector("#formPublicarMensaje");

formMensaje.submit = (e) => {
    e.preventDefault();
    const mensaje = {
        mail: document.querySelector("#mail").value,
        texto: document.querySelector("#texto").value
    }

    socket.emit('nuevo-mensaje', mensaje)
}

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
