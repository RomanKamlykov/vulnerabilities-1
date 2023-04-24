import express from 'express';
import passport from '../passport';
import {users} from '../users';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('pages/login');
});

router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
}));

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

router.get('/signup', (req, res, next) => {
    res.render('pages/signup');
});

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body as {username?: string, password?: string};
    if (!username || !password) {
        res.redirect('/signup');
    }
    else if (users.some(user => user.username === username)) {
        res.redirect('/signup');
    }
    else {
        const id = users.reduce((acc, user) => user.id > acc ? user.id : acc, 0) + 1;
        const user = {
            id,
            username,
            password,
        };
        users.push(user);
        req.login(user, function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }
});

export const authRouter = router;
