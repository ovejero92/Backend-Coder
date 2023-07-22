import passport from "passport";
import GitHubStrategy from "passport-github2"
import googleStrategy from "passport-google-oauth20"
import local from "passport-local"
import passport_jwt from 'passport-jwt'
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword, generateToken, extractCookie, JWT_PRIVATE_KEY } from '../utils.js'
import logger from '../logger.js'

const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.98bf562ca66b0589',
        clientSecret: '293eb8e8e3954039acd5848ceabba8a743e64c89',
        callbackURL: 'http://localhost:8080/session/githubcallback'
      }, async(accessTOken, refreshToken, profile, done) => {
          logger.info(profile)
          try {
         const user = await UserModel.findOne({ email: profile._json.email })
           if(user) return done (null, user)
  
           const newUser = await UserModel.create({
              first_name: profile._json.name,
              email: profile._json.email,
           })
  
           return done(null, newUser)
          } catch(err) {
              return done ('error con el logueo de Github')
          }
      }))
  

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const {first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({email: username})
            if(user) {
                logger.error("User already exits");
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            
            return done(null, result)
        } catch (error) {
            return done("[LOCAL] Error al obtener user " + error)
        }


    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({email: username})
            if(!user) {
                logger.error("User dont exist");
                return done(null, user)
            }

            if(!isValidPassword(user, password)) return done(null, false)

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch (error) {
            
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.use('google', new googleStrategy({
        clientID: '768780921282-lqrhrgli4r23hlu4ovj8f5hrohest2dv.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8080/auth/google'
       }, async(accessTOken, refreshToken, profile, done) => {
        logger.info(profile)
        try {
       const user = await UserModel.findOne({ googleId: profile.id })
         if(user) return done (null, user)
    
         const newUser = await UserModel.create({
            first_name: profile.id,
            email: profile.email,
         })
    
         return done(null, newUser)
        } catch(err) {
            return done ('error con el logueo de Github')
        }  
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport;