const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const appConfig = require('../app-config');

module.exports = (app) => {

    app.use(cookieParser());

    app.use(express.urlencoded({
        extended: true
    }));

    app.engine('hbs', handlebars({
        layoutsDir: 'views',
        defaultLayout: false,
        //partialsDir: 'views/partials',
        extname: 'hbs'
    }));

    app.use((req, res, next) => {
        res.locals.isLoggedIn = req.cookies[appConfig.authCookieName] !== undefined;
        res.locals.username = req.cookies['username'];
        next();
    })

    app.set('view engine', 'hbs');

    app.use(express.static('./static'))
};