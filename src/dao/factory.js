import config from '../config/config.js'

// export let Product
export default class Product {
    constructor(id, title, price, stock, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.stock = stock;
        this.category = category;
    }
}

switch (config.persistence) {
    case 'MONGO':
        const { default: Product} = await import('./mongo/product.mongo.dao.js')
        Product = Product
        break;

    default:
        break;
}