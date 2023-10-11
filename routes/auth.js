const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Principal = require('../models/Principal');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        res.status(500).send(JSON.stringify({result: 'Error', message: 'Username, Email and Password required'}));
    } else {
        try {
            let principal = await Principal.findOne({ email: email });
            if(principal) {
                res.status(500).send(JSON.stringify({result: 'Error', message: 'The account already registered'}));
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) {
                            throw err;
                        }
                        principal = new Principal({
                            name: name, email: email, password: hash}
                        );
                        principal.save().then( () => res.status(200).send(JSON.stringify({result: 'OK'}))).catch(err => {throw err});
                    });
                });
            }
        } catch(e) {
            res.status(500).send(JSON.stringify({result: 'Error', message: e}));
        }                
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(500).json({result: 'Error', message: 'Email and Password required'});
    } else {
        try {
            let principal = await Principal.findOne({ email: email });
            if(!principal) {
                res.status(500).json({result: 'Error', message: 'Incorrect email or password'});
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) {
                            throw err;
                        }
                        bcrypt.compare(password, principal.password, (err, isMatch) => {
                            if(err) {
                                throw err;
                            }
                            if(isMatch) {
                                const payload = {
                                    userId: principal._id
                                }
                                const token = jwt.sign(payload, process.env.SecretKey, {expiresIn: '1h'});
                                req.session.token = token;
                                principal.lastLogin = new Date();
                                principal.loginCount++;
                                principal.save();
                                res.status(200).json({result: 'OK', token: token});
                            } else {
                                res.status(500).json({result: 'Error', message: 'Incorrect email or password'});
                            }
    
                        });
                    });
                });
            }
        } catch(e) {
            res.status(500).json({result: 'Error', message: e});
        }                
    }
});

module.exports = router;
