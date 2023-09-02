import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const JWT_PRIVATE_KEY = "Kanguro"
export const JWT_COOKIE_NAME = "canguroCookieToken"

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateRandomString = (num) => {
    return [...Array(num)].map(() => {
        const randomNum = ~~(Math.random() *36); // el 36 son todas las letras del alfabeto mas los numeros en total son 36
        return randomNum.toString(36); // asi lo hacemos con letras y numeros
    })
    .join('')
    .toUpperCase(); // esto sig que esta todo en mayuscula 
}

export const generateToken = user => {
    return jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h'})
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', {
                error: info.messages ? info.messages : info.toString()
            })
            req.user = user
            next()
        })(req, res, next)
    }
}
