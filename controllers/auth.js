const models = require('../models');
const utils = require('../utils');
const appConfig = require('../app-config');


function login(req, res) {
    const hbsObject = {
        pageTitle: 'Login Page',
    };
    res.render('login.hbs', { hbsObject });
}

function loginPost(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        const hbsObject = {
            messages: ['Enter password and username!'],
            pageTitle: 'Register Page'
        }
        res.render('login.hbs', { hbsObject });
        return;
    }

    models.userModel
        .findOne({ username })
        .then(user => {
            return Promise.all([user, user ? user.matchPassword(password) : false]);
        }).then(([user, match]) => {
            if (!match) {
                const hbsObject = {
                    messages: ['Wrong password or username!'],
                    pageTitle: 'Login Page'
                }
                res.render('login.hbs', { hbsObject });
                return;
            }
            const token = utils.jwt.createToken({ id: user._id });
            res.cookie(appConfig.authCookieName, token).cookie('username', user.username).redirect('/expenses');
        });

}

function register(req, res) {
    const hbsObject = {
        pageTitle: 'Register Page',
    };
    res.render('register.hbs', { hbsObject });
}

function registerPost(req, res, next) {
    const { username, password, repeatPassword, amount} = req.body;

    if (password !== repeatPassword) {
        const hbsObject = {
            messages: ['Password and repeat password don\'t match!'],
            pageTitle: 'Register Page'
        }
        res.render('register.hbs', { hbsObject });
        return;
    }

    return models.userModel.create({ username, password,amount })
        .then(() => {
            res.redirect('/login');
        })
        .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'MongoooseError') {
                const messages = Object.entries(err.errors).map(e => {
                    return e[1].message;
                })
                const hbsObject = {
                    messages,
                    pageTitle: 'Register Page'
                }
                res.render('register.hbs', { hbsObject });
                return;
            }
        });
}

function logout(req, res) {
    const token = req.cookies[appConfig.authCookieName];
    models.tokenBlacklistModel.create({ token }).then(() => {
        res.clearCookie(appConfig.authCookieName).clearCookie('username').redirect('/');
    });

}

module.exports = {
    login,
    loginPost,
    register,
    registerPost,
    logout
};