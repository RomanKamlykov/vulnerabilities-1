import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {users} from './users';

passport.use('local', new LocalStrategy((username, password, done) => {
    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
        done(null, user);
    } else {
        done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId: typeof users[number]['id'], done) => {
    const user = users.find(user => user.id === userId);
    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

export default passport;
