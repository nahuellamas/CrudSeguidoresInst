const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');

router.get('/signin' , (req, res) => {
    res.render('users/singin');
} );

router.post('/signin', passport.authenticate('local', {
    successRedirect: '/cliente',
    failureRedirect: '/signin',
    failureFlash: true
}));

router.get('/signup' , (req, res) => {
    res.render('users/singup');
} );

router.post('/signup' , async (req, res) => {
    const {nombre, apellido, email, password, confirm_password, roles } = req.body;
    const errors = [];
    if(nombre.length <= 0){
        errors.push({text: 'Inserte un nombre'})
    }
    if(apellido.length <= 0){
        errors.push({text: 'Inserte un Apellido'})
    }
    if(password.length <= 0){
        errors.push({text: 'Inserte una Contraseña'})
    }
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length < 4){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres'});
    }
    if(errors.length > 0){
        res.render("users/singup", {errors, nombre, apellido, email, password});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'El email ya tiene un registro')
            res.redirect('/signup') 
        }
        const newUser = new User({nombre, apellido, email, password, roles});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Tu registro se genero correctamente');
        res.redirect('/signin');
    }
    
} );

router.get('/cliente/salir', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;