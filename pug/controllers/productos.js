const fs = require("fs")
const path = require("path")

class ProductosApi {
    constructor() {
        this.productos = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../data/productos.json')))
        this.id = this.productos.length == 0 ? 0 : this.productos[this.productos.length -1].id
    }

    listar(id) {
        const prod = this.productos.find(prod => prod.id == id)
        return prod || { error: 'producto no encontrado' }
    }

    listarAll() {
        return [...this.productos]
    }

    guardar(prod) {
        const newProd = { ...prod, id: ++this.id }
        this.productos.push(newProd)
        fs.writeFileSync(path.resolve(__dirname,'../data/productos.json'),JSON.stringify(this.productos,null,2))
        return newProd
    }

    actualizar(prod, id) {
        const newProd = { id: Number(id), ...prod }
        const index = this.productos.findIndex(p => p.id == id)
        if (index !== -1) {
            this.productos[index] = newProd
            fs.writeFileSync(path.resolve(__dirname,'../data/productos.json'),JSON.stringify(this.productos,null,2))
            return newProd
        } else {
            return { error: 'producto no encontrado' }
        }
    }

    borrar(id) {
        const index = this.productos.findIndex(prod => prod.id == id)
        if (index !== -1) {
            this.productos.splice(index, 1)
            fs.writeFileSync(path.resolve(__dirname,'../data/productos.json'),JSON.stringify(this.productos,null,2))
            return this.productos 
        } else {
            return { error: 'producto no encontrado' }
        }
    }
}

module.exports = ProductosApi
