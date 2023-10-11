const jwt = require('jsonwebtoken');

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.session.token !== null) {
            jwt.verify(req.session.token, process.env.SecretKey, (err, decoded) => {
                if (err) {
                    res.redirect('/login');
                } else {
                    req.userId = decoded.userId;
                    next();
                }
            });
        } else {
            res.redirect('/login');
        }
    },
    ensureBearerToken: function (req, res, next) {
        const authorization = req.headers['authorization'];
        const tokenInSession = req.session.token;

        if (authorization && tokenInSession) {
            const token = authorization.split(' ')[1];
            if (tokenInSession === token) {
                jwt.verify(token, process.env.SecretKey, (err, decoded) => {
                    if (err) {
                        throw err;
                    } else {
                        req.userId = decoded.userId;
                        next();
                    }
                });
            } else {
                throw new Error('Not authorizaed');
            }
        } else {
            throw new Error('No authorization header');
        }
    }
};