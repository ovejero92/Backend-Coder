import mongoose from "mongoose";
// import config from '../../config/config.js';
import loggers from '../../config/logger.js'
import customError from '../../services/error.log.js';

const mongoConnection = 'mongodb+srv://Kanguro:Cyg190921@cangaru.m6wo2de.mongodb.net/Kanguro';
const mongoDatabase = 'Kanguro';

export default class MongoClient {
    constructor() {
        this.connected = true
        this.client = mongoose
    }

    connect = async() => {
        try {
            this.client.connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true });
            loggers.info(`Conexión exitosa a la base de datos "${mongoDatabase}" => MongoDB Atlas`);
        } catch(error) {
            customError(error);
            loggers.fatal('Imposible conectarse a MongoDB Atlas');
        }
    }
}