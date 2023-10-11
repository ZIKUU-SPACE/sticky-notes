require('dotenv').config()

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const authGuard = require('./auth/auth').ensureAuthenticated;
const bearerCheck = require('./auth/auth').ensureBearerToken;

const app = express();

const PORT = process.env.SERVER_PORT || 3000;


mongoose.connection.on('open', ref => console.log('Connected to mongodb') );
mongoose.connection.on('error', err => console.log('err') );
mongoose.connect(
    process.env.MongoURI,{}
);

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({ extended: false}));
app.use(session({secret: process.env.SecretKey, resave: false, saveUninitialized: false}));


app.get("/login", (req, res) => {
    req.session.token = null;
    res.sendFile(path.resolve("frontend", "login.html"))
});

app.get("/register", (req, res) => {
    res.sendFile(path.resolve("frontend", "register.html"))
});

app.use('/auth', require('./routes/auth'));
app.use('/api', bearerCheck, require('./routes/api'));

app.get("/", authGuard, (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html"));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.redirect("/login");
});

app.listen(PORT, () => console.log(`Server listening port ${PORT}...`));