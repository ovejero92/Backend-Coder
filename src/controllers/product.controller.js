// import productModel from "../dao/models/products.model.js"
import {ProductService} from '../repositories/index.js';
import {PORT} from '../app.js'
import logger from '../logger.js'
export const getProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 10
        const page = req.query.page || 1
        const filterOptions = {}
        if(req.query.stock) filterOptions.stock = req.query.stock
        if(req.query.category) filterOptions.category = req.query.category
        const paginateOptions = {lean: true, limit, page}
        if(req.query.sort === 'asc') paginateOptions.sort = {price:1}
        if(req.query.sort === 'desc') paginateOptions.sort = {price:-1}
        const result = await productModel.paginate(filsterOptions, paginateOptions)
        let prevLink
        if(!req.query.page){prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`
    } else {
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
        prevLink =`http://${req.hostname}:${PORT}${modifiedUrl}`
    }
    let nextLink
    if(!req.query.page) {
        nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`
    } else {
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
    }
    return {
        statusCode: 200,
        response: {
            status: 'success',
            payload: result.docs,
            totalPAges: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? prevLink : null,
            nextLink: result.hasNextPage ? nextLink : null
        }
    }
    } catch(err) {
       return{ statusCode:500,
        response:{status:'error', error: err.message}
    }}
}
export const getAllProductsController = async (req, res) => {
    // const result = await getProducts(req, res)
    const result = await ProductService.getAll()
    // res.status(result.statusCode).json(result.response)
    res.json(result)
}
export const getProductByIdController = async (req, res) => {
    try{
    const id = req.params.pid
    // const result = await productModel.findById(id).lean().exec()
    const result = await ProductService.getById(id)
    if (result === null) {
        return res.status(404). json ({ status: 'error', error:'not found'})
    }
    res.status(200).json({status:'success', payload: result})
    } catch(err) {
        res.status(500).json({status:'error', error:err.message})
    }
}

export const createProductController = async (req, res) => {
    try{
        const product = req.body
        // const result = await productModel.create(product)
        const result = await ProductService.create(product)
        // const products = await productModel.find().lean().exec()
        const products = await ProductService.getAll()
        req.io.emit('updatedProducs', products)
        res.status(201).json({status:'success', payload:result})
    } catch(err) {
        res.status(500).json({status:'error', error: err.message})
        logger.error(err)
    }
}

export const udpateProductController = async (req, res) => {
    try{
        const id = req.params.pid
        const data = req.body
        // const result = await productModel.findByIdAndUpdate(id,data, {returnDocument: 'after'})
        const result = await ProductService.findByIdAndUpdate(id,data,{returnDocument:'after'})
        if(result === null) {
            return res.status(404).json({status:'error', error: 'not found'})
        }
        // const products = await productModel.find().lean().exec()
        const products = await ProductService.find().lean().exec()
        req.io.emit('updateProducts', products)
        res.status(200).json({status:'success', payload: result})
    } catch(err){
        res.status(500).json({status:'error', error:err.message})
    }
}
export const deleteProductController = async (req, res) => {
    try {
        const id = req.params.pid
        // const result = await productModel.findByIdAndDelete(id)
        const result = await ProductService.findByIdAndDelete(id)
        if(result === null) {
            return res.status(404).json({status:'error', error:'not found'})
        }
        const products = await productModel.find().lean().exec()
        req.io.emit('updatedProducts', products)
    } catch(err) {
      res.status(500).json({status:'error', error: err.message})
    }
}