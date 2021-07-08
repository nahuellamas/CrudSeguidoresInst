const helpers = {};
const Role = require('../models/role');


helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'No ingreso a su cuenta');
    res.redirect('/signin');
};

module.exports = helpers;