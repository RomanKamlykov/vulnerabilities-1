import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from './passport';
import {appRouter} from './routers/app.router';
import {authRouter} from './routers/auth.router';

declare module 'express-session' {
    interface SessionData {
        xssProtection: boolean
        csrfProtection: boolean
    }
}

declare global {
    namespace Express {
        interface User {
            id: number
            username: string
            password: string
        }
    }
}

export function createApp() {
    const app = express();

    app.set('views', 'views');
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(session({
        secret: 'd5021cf3efd274945ee59bc7621f14c3',
        resave: false,
        saveUninitialized: true,
    }));
    app.use((req, res, next) => {
        // Set initial values to the session object
        req.session['xssProtection'] ??= true;
        req.session['csrfProtection'] ??= true;
        next();
    });
    app.use(passport.authenticate('session'));
    app.use('/', appRouter);
    app.use('/', authRouter);

    return app;
}
