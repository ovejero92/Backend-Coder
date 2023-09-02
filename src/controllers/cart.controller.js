import CartModel from "../models/cart.model.js";
import productModel from "../models/products.model.js";

export const getProductsFromCart = async (req , res) => {
    try{ 
        const id = req.params.cid
        const result = await CartModel-findById(id).populate('products.product').lean()
        if(result === null) {
            return {
                status: 404, response: { status: 'error' , error: 'not found'}
            }
        }
        return {statusCode:200,response:{status:'success', payload:result}}
    } catch(err) {
        return {statusCode:500,response: {status:'error', error:err.message}}
    }
}

export const createCartController = async (req , res) => {
    try {
        const result = await CartModel.create({})
        res.status(201).json({status:'success' , payload: result})
    } catch(err){res.status(500).json({status: 'error', error: err.message})
}}

export const getProductsFromCartController = async (req , res) => {
    const result = await getProductsFromCart(req,res)
    res.status(result.statusCode).json(result.response)
}
export const addProductToCartController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await CartModel.findById(cid)
        if(cartToUpdate === null) {
            return res.status(404).json({status:'error', error: `Cart with id=${cid} Not Found`})
        }
        const productToadd = await productModel.findById(pid)
        if (productToadd === null) {
            return res.status(404).json({status:'error', error:`Product with id=${pid} Not found`})
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex > -1) {
          cartToUpdate.products[productIndex].quantity += 1
        }else {cartToUpdate.products.push({product:pid,quantity:1})
    }
        const result = await CartModel.findByIdAndUpdate(cid,cartToUpdate, {returnDocument:'after'})
        res.status(201).json({status:'success', payload:result})
    } catch(err){res.status(500).json({status:'error', error:err.message})
}
}

export const deleteProductFromCartController = async (req,res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await CartModel.findById(cid)
        if (cartToUpdate === null) {return res.status(404).json({status:'error', error:`cart with id=${cid} Not found`})}
        const productToDelete = await productModel.findById(pid)
        if(productToDelete === null) {return res.status(404).json({status:'error', error:`cart with id=${pid} Not found`})}
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex === -1) {return res.status(400).json({status:'error', error:`Product with id=${pid} Not found` })}
    } catch(err){res.status(500).json({status:'error', error: err.message})}
}

export const updateCartController = async (req,res) => {
    try{
        const cid = req.params.cid
        const cartToUpdate = await CartModel.findById(cid)
        if(cartToUpdate === null){return res.status(400).json({status:'error', error:`Card with id=${cid} Not found` })}
        const products = req.body.products
        if(!products){return res.status(400).json({status:'error', error:'filed "products"is not optional' })}
        for (let index = 0; index < products.length; index++) {
           if(!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity')) {
            return res.status(400).json({status:'error', error:`product must have a valid id and a valid` })
           }
           if (typeof products[index].quantity !== 'number') {return res.status(400).json({status:'error', error:`Product\'s quantity must be a number` })}
           if (products[index].quantity === 0) { return res.status(400).json({status:'error', error:`Product\'s quantity cannot be 0` })}
           const productToadd = await productModel.findById(products[index].product)
           if(productToadd === null){return res.status(400).json({status:'error', error:`Product with id=${products[index].product} ` })} 
        }
        // fin de las validaciones del array enviado por body
        cartToUpdate.products = products
        const result = await CartModel.findByIdAndUpdate(cid,cartToUpdate, {returnDocument: 'after'})
        res.status(200).json({status:'success', payload: result})
    } catch(err){ res.status(500).json({status:'error', error:err.message})}
}

export const updateProductQtyFromCartController = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await CartModel.findById(cid)
        if (cartToUpdate === null){return res.status(400).json({status:'error', error:`Product with id=${cid} Not found` })}
        const productToUpdate = await productModel.findById(pid)
        if(productToUpdate === null){return res.status(400).json({status:'error', error:`Product with id=${pid} Not found` })}
        const quantity = req.bosy.quantity
        // inicio de validacion de cantidad enviado por body
        if(!quantity){return res.status(400).json({status:'error', error: 'field "cuantity" is not oprional'})}
        if (typeof quantity !== 'number'){return res.status(400).json({status:'error', error:`Product\'s quantity must be a number` })}
        if(quantity === 0) { return res.status(400).json({status:'error', error:`Product\'s quantity cannot be 0` })}
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if (productIndex === -1){return res.status(400).json({status:'error', error: `product id=${pid} not found in cart`})}else{cartToUpdate.products[productIndex].quantity = quantity}
        // fin de las validaciones de quantity
        const result = await CartModel.findByIdAndUpdate(cid,cartToUpdate, {returnDocument:'after'})
        res.status(200).json({status:'success', payload:result})
    }catch(err) {res.status(500).jdon({status:'error', error:err.message})} 
}

export const clearCartController = async (req, res) => {
    try {
        const cid = req.params.cid
        const cartToUpdate = await CartModel.findById(cid)
        if (cartToUpdate === null) { return res.status(400).json({status:'error', error:`cart id=${cid} not found` })}
        cartToUpdate.products = []
        const result = await CartModel.findByIdAndUpdate(cid, cartToUpdate,{ returnDocument: 'after'})
        res.status(200).json({status:'success', payload:result})
    }catch(err){res.status(500).json({status:'error', error: err.message})}
}