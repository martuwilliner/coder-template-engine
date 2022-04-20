const fs = require("fs")
const path = require("path")

class ChatApi {
    constructor() {
        this.chat = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../data/chat.json')))
        this.id = this.chat.length == 0 ? 0 : this.chat[this.chat.length -1].id
    }

    listar(id) {
        const msg = this.chat.find(msg => msg.id == id)
        return msg || { error: 'mensaje no encontrado' }
    }

    listarAll() {
        return [...this.chat]
    }

    guardar(msg) {
        const newMsg = { ...msg, id: ++this.id }
        this.chat.push(newMsg)
        fs.writeFileSync(path.resolve(__dirname,'../data/chat.json'),JSON.stringify(this.chat,null,2))
        return newMsg
    }

    actualizar(msg, id) {
        const newMsg = { id: Number(id), ...msg }
        const index = this.chat.findIndex(m => m.id == id)
        if (index !== -1) {
            this.chat[index] = newMsg
            fs.writeFileSync(path.resolve(__dirname,'../data/chat.json'),JSON.stringify(this.chat,null,2))
            return newMsg
        } else {
            return { error: 'mensaje no encontrado' }
        }
    }

    borrar(id) {
        const index = this.chat.findIndex(msg => msg.id == id)
        if (index !== -1) {
            this.chat.splice(index, 1)
            fs.writeFileSync(path.resolve(__dirname,'../data/chat.json'),JSON.stringify(this.chat,null,2))
            return this.chat 
        } else {
            return { error: 'mensaje no encontrado' }
        }
    }
}

module.exports = ChatApi