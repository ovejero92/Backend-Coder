import express from "express";
import cors from 'cors'
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser"
import initializePassport from "./config/passport.config.js";
import dotenv from 'dotenv'
import { Command } from "commander";
import logger from './logger.js'

import __dirname from "./utils.js"
import run from "./run.js";

const app = express()

const program = new Command()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(cors())


program
  .option('--mode <mode>', 'description', 'development')
dotenv.config({
    path: (program.opts().mode === 'development') ? './.env.development' : './.env.production'
})
export const MONGO_URI = process.env.MONGO_URI
const MONGO_DB_NAME = process.env.DB_NAME

app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(MONGO_URI, {
    dbName: MONGO_DB_NAME
}, (error) => {
    if(error){
        logger.error(`no se pudo conectar con la Base de datos: ${MONGO_DB_NAME}`)
        return
    }
    
    

     const PORT = process.env.PORT || 8080

    const httpServer = app.listen(PORT, () => {logger.info(`Puerto n° ${PORT}`)})
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => logger.fatal("ERROR: " + e))

    run(socketServer, app)
})