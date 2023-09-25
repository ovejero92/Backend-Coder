import session from 'express-session';
import MongoStore from 'connect-mongo';
// import config from '../config/config.js';

const configureSession = (app) => {
    const mongoConnection ='mongodb+srv://Kanguro:Cyg190921@cangaru.m6wo2de.mongodb.net/';
    const mongoDatabase = 'Kanguro';
    const secret = 'mysecret';

    app.use(
        session({
            secret: secret,
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl: mongoConnection,
                dbName: mongoDatabase,
                collectionName: 'sessions',
                mongoOptions: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
            }),
        })
    );

    app.use((req, res, next) => {
        res.locals.isLoggedIn = req.session.user ? true : false;
        res.locals.userRole = req.session.user ? req.session.user.role : null;
        next();
    });
};

export default configureSession;
