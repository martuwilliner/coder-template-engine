const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');

const ProductosApi = require('../controllers/productos.js')
const ChatApi = require('../controllers/chat.js')

const productosApi = new ProductosApi()
const mensajeApi = new ChatApi()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')));

//--------------------------------------------

app.set('views', './views');
app.set('view engine', 'pug');

//--------------------------------------------

app.post('/productos', (req, res) => {
    const producto = req.body
    productosApi.guardar(producto)
    res.redirect('/')
})

app.get('/productos', (req, res) => {
    const prods = productosApi.listarAll()

    res.render("vista", {
        productos: prods,
        hayProductos: prods.length
    });
});



//----------------------------------------------------------------


//Socket io implementation
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado')
    socket.emit('listar-productos', productosApi.listarAll())

    socket.emit('mensajes', mensajeApi.getAllMessages())

    socket.on('disconnect', () => {
        console.log('Cliente desconectado')
    })
    socket.on('nuevo-producto', (producto) => {
        productosApi.guardar(producto)
        socket.emit('nuevo-producto', producto)
    })

    /* socket.on('nuevo-mensaje', (mensaje) => {
        console.log(mensaje)
        chatApi.saveMessage(mensaje)
        socket.emit('mensajes', chatApi.getAllMessages())
    }) */

    socket.on('nuevo-mensaje', (msg) => {
        console.log('mensaje: ' + msg);
        mensajeApi.saveMessage(msg);
        io.sockets.emit('mensajes', mensajeApi.getAllMessages());
    });


    
})



//--------------------------------------------
const PORT = 8080
server.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

