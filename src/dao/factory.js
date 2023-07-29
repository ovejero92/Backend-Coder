import config from '../config/config.js';

export let Product

switch (config.persistence) {
    case 'MONGO':
        const { default: productMongoDao} = await import('./mongo/product.mongo.dao.js')
        Product = productMongoDao
        break;

    default:
        break;
}