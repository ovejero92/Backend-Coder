import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import Users from '../daos/models/users.model.js';
import jwt from 'jsonwebtoken';
// import config from '../config/config.js';
import loggers from '../config/logger.js'
import customError from '../services/error.log.js';

// Variables de entorno
const secret = "Kanguro";
const cookieName ="canguroCookieToken";

const clientID = 'Iv1.98bf562ca66b0589';
const clientSecret = '293eb8e8e3954039acd5848ceabba8a743e64c89';
const callbackURL = 'http://localhost:8080/session/githubcallback';



// Configurar la estrategia local de Passport
const initializePassportGH = () => {
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: clientID,
                clientSecret: clientSecret,
                callbackURL: callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await Users.findOne({ email: profile._json.email });
                    if (user) return done(null, user);

                    const newUser = await Users.create({
                        first_name: profile._json.name,
                        email: profile._json.email,
                        role: 'user',
                    });
                    const token = jwt.sign({ userId: newUser._id }, secret);
                    res.cookie(cookieName, token, {
                        httpOnly: true,
                        secure: true,
                    });
                    return done(null, newUser);
                } catch (error) {
                    customError(error);
                    loggers.error('Error to login with GitHub');
                    return done('Error to login with GitHub');
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await Users.findById(id);
        done(null, user);
    });
};

export default initializePassportGH;
