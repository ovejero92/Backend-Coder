import { Router } from "express";
import passport from "passport";
import { JWT_COOKIE_NAME, generateRandomString } from '../utils.js'
import logger from '../logger.js'
import UserPasswordModel from "../models/user.password.model.js";
import UserModel from '../models/user.model.js';

const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
    res.redirect('/session/login')
})
router.get('/failregister', (req, res) => {
    logger.error('Fail Strategy');
    res.send({ error: "Failed" })
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentiales" })
    }
   
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
})

router.post('/forget-password', async (req, res) => {
    const email = req.body.email
    const user = await UserModel.findOne({email})
    if(!user) {
        return res.status(404).json({status: 'error', error: 'user not found'})
    }
    const token = generateRandomString(16);
    await UserPasswordModel.create({email, token})
    const mailerConfig = {
        servise: 'gmail',
        auth: {user: config.nodemailer.user,pass: config.nodemailer.pass}
    }
    let transporter = nodemailer.createTransport(mailerConfig)
    let message = {
        from: config.nodemailer.user,
        to: email,
        subject: '[coder e-comm API] reset your password',
        html:`<h1>[coder e-comm api] Rest your password </h1> <hr /> You have asked to reset you password `
    }
    try{
        await transporter.sendMail(message)
        res.json({status:'success', message:`Email succesfully sent to ${email} in order to reset`})
    }catch (err) {
        res.status(500).json({status: 'error', error: err.message})
    }
})

router.get('/github', passport.authenticate('github', { scope:["user:email"]}), (req, res) =>{})
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),
 async(req,res) => {
    req.session.user = req.user
    res.redirect('/products')
 })
 router.get('/google', passport.authenticate('google', {scope:["user:email"]}, (req, res) => {}))
 router.get('/auth/google', passport.authenticate('google',  {failureRedirect: '/login'}, 
 async(req, res) => {
    req.session.user = req.user
    res.redirect('/protucts')
 }))

router.get('/faillogin', (req, res) => {
    res.render('errors/base')
})

// Cerrar Session
router.get('/session/logout', (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')
})



export default router