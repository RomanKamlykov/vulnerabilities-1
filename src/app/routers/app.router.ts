import express from 'express';
import {ensureLoggedIn} from 'connect-ensure-login';
import {csrfProtection} from '../csurf';
import {messages} from '../messages';
import {users} from '../users';

const router = express.Router();

router.get('/', ensureLoggedIn(), csrfProtection, (req, res) => {
    const user = req.user;
    const xssProtection = req.session['xssProtection'];
    const csrfToken = req.csrfToken();
    res.render('pages/index', {messages, user, xssProtection, csrfToken});
});

router.post('/', ensureLoggedIn(), (req, res, next) => {req.session['csrfProtection'] ? csrfProtection(req, res, next) : next();}, (req, res) => {
    const {text} = req.body as {text: string}
    const id = messages.reduce((acc, message) => message.id > acc ? message.id : acc, 0) + 1;
    const user = req.user;
    if (text && id && user) {
        const message = {
            id,
            text,
            userId: user.id,
            date: new Date(),
        }
        messages.push(message);
    }
    if (messages.length > 20) {
        messages.shift();
    }
    res.redirect('/');
});

router.get('/help', ensureLoggedIn(), (req, res) => {
    res.render('pages/help');
});

router.get('/settings', ensureLoggedIn(), (req, res) => {
    const xssProtection = req.session['xssProtection'];
    const csrfProtection = req.session['csrfProtection'];
    res.render('pages/settings', {xssProtection, csrfProtection});
});

router.post('/settings', ensureLoggedIn(), (req, res) => {
    const {xssProtection, csrfProtection} = req.body as {xssProtection?: 'on', csrfProtection?: 'on'};
    req.session['xssProtection'] = xssProtection === 'on';
    req.session['csrfProtection'] = csrfProtection === 'on';
    res.redirect('/');
});

router.post('/reset', ensureLoggedIn(), (req, res) => {
    messages.length = 0;
    users.length = 0;
    res.redirect('/');
});

export const appRouter = router;
