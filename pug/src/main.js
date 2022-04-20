const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require( 'socket.io' )

const ProductosApi = require('../controllers/productos.js')
const ChatApi = require('../controllers/chat.js')

const productosApi = new ProductosApi()
const chatApi = new ChatApi()


const app = express()

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

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

app.get('/chat', (req, res) => {
    const mensajes = chatApi.listarAll()

    res.render("chat", {
        mensajes: mensajes,
        hayMensajes: mensajes.length
    })
})

app.post('/', (req, res) => {
    const mensaje = req.body
    const msg = chatApi.guardar(mensaje)
    io.emit('mensaje', msg)
    res.redirect('/')
})

//----------------------------------------------------------------


//Socket io implementation
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado')
    socket.emit('listar-productos', productosApi.listarAll())

    socket.emit('mensajes', chatApi.listarAll())

    socket.on('disconnect', () => {
        console.log('Cliente desconectado')
    })
    socket.on('nuevo-producto', (producto) => {
        productosApi.guardar(producto)
        socket.emit('nuevo-producto', producto)
    })

    socket.on('nuevo-mensaje', (mensaje) => {
        chatApi.guardar(mensaje)
        socket.emit('nuevo-mensaje', mensaje)
    })


    
})



//--------------------------------------------
const PORT = 8080
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

