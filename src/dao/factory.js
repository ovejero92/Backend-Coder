import config from '../config/config.js'

// export let Product
export default class Product {
    constructor(id, name, price, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
    }
}

switch (config.persistence) {
    case 'MONGO':
        const { default: ProductMongoDAO} = await import('./mongo/product.mongo.dao.js')
        Product = ProductMongoDAO
        break;

    default:
        break;
}