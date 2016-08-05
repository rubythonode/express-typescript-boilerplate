/// <reference path="./typings/index.d.ts" />

import * as http from "http";
import * as url from "url";
import * as express from "express";
import * as bodyParser from "body-parser";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import * as morgan from 'morgan';
import * as jwt from 'jsonwebtoken';

import * as config from './config/config';
import * as routes from "./routes/index";
import * as routes_auth from "./routes/auth";
import * as routes_users from "./routes/users";
import middleware_authenticate = require("./middleware/authenticate");

var app = express();

/*

https://ole.michelsen.dk/blog/social-signin-spa-jwt-server.html

*/

// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

// use morgan to log requests to the console
app.use(morgan('dev'));

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    app.use(errorHandler());
}

// Routes

app.use('/', routes);
app.use('/auth', routes_auth); // uprotected route for authentication
app.use('/api', middleware_authenticate, routes_users); // protected user api

app.listen(config.PORT, function(){
    console.log("Demo Express server listening on port %d in %s mode", config.PORT, app.settings.env);
});

export var App = app;