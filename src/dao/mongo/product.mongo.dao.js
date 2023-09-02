import productModel from '../../models/products.model.js'

export default class Product {
    constructor(){}
    getAll = async () => await productModel.find()
    getById = async (id) => await productModel.findById(id)
    create = async (data) => await productModel.create(data)
    update = async(id,data) => await productModel.findByIdAndUpdate(id, data, {returnDocument: 'after'}) // el ultimo argumento es porque cuando actualizamos nos devuelve los datos anteriores y no los actuales por eso ponemos ese argumento final
    delete = async(id) => await productModel.findByIdAndDelete(id)
}