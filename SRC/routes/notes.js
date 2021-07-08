const express = require('express');
const router = express.Router();
const instCuenta = require('../models/task')
const {isAuthenticated} = require('../helpers/auth')

router.get('/cliente/nueva-carga' , isAuthenticated, (req, res) => {
    res.render('cargadenotas/cargaseguidores');
} );

router.post('/cliente/notas', isAuthenticated, async (req, res) => {
    const {nombre, cantidadSeguidores, cuentaInstagram, date, status} = req.body;
    const errors = [];
    if(!nombre){
        errors.push({text: 'Inserte un nombre'});
    }
    //if(!imagen){
        //errors.push({text: 'Ingrese una screenshot de la cuenta de instagram'});
    //}
    if(!cuentaInstagram){
        errors.push({text: 'Inserte el nombre de la cuenta de Instagram'});
    }
    if(!cantidadSeguidores){
        errors.push({text: 'Inserte el numero de seguidores a cargar'});
    }
    if(errors.length > 0){
        res.render('cargadenotas/cargaseguidores', {
            errors,
            nombre,
            cuentaInstagram,
            cantidadSeguidores
        });
    } else {
        const nuevaCuentaInst = new instCuenta({date, nombre, cantidadSeguidores, cuentaInstagram, status });
        nuevaCuentaInst.user = req.user.id;
        await nuevaCuentaInst.save();
        req.flash('success_msg', 'Pedido agregado satisfactoriamente!');
        res.redirect('/cliente');
    }
    
});


router.get('/cliente' , isAuthenticated, async (req, res) => {
   //const instcuenta = await instCuenta.find();
   //res.render('cargadenotas/old-cuentasinst', {instcuenta});
   await instCuenta.find({user: req.user.id}).sort({date: 'desc'})
    .then(documentos => {
            const contexto = {
                instCuenta: documentos.map(documento => {
                    return{
                        id: documento.id,
                        nombre: documento.nombre,
                        date: documento.date.toISOString().substring(0,10),
                        cantidadSeguidores: documento.cantidadSeguidores,
                        cuentaInstagram: documento.cuentaInstagram
                    }
                })
            }
            res.render('cargadenotas/old-cuentasinst', {instCuenta: contexto.instCuenta})
        })
});
/*Una solucion mas sencilla seria mapear a json 

router.get('/notes', async (req, res) => {
    await Note.find().sort({date: 'desc'})


    .then(notes => {
        res.render('notes/all-notes', {
            notes: notes.map(notes => notes.toJSON())
        })
    })
})*/ 

router.get('/cliente/edit/:id', isAuthenticated, async (req, res) =>{
    const editpedido = await instCuenta.findById(req.params.id).lean();
    res.render('cargadenotas/editpedido', {editpedido});
});

router.put('/cliente/pedido-editado/:id',  isAuthenticated, async (req, res) => {
    const {date, nombre, cantidadSeguidores, cuentaInstagram} = req.body;
    await instCuenta.findByIdAndUpdate(req.params.id, {date, nombre, cantidadSeguidores, cuentaInstagram});
    req.flash('success_msg', 'Pedido editado!');
    res.redirect('/cliente');
});

router.delete('/cliente/delete/:id' , isAuthenticated, async (req, res) => {
    await instCuenta.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Pedido eliminado');
    res.redirect('/cliente');
});

router.get('/clientes' , isAuthenticated, (req, res) => {
    res.send('clientes desde base de datos');
} );

router.get('/vendedor' , isAuthenticated, (req, res) => {
    res.send('notas del vendedor');
} );

router.get('/administrador', isAuthenticated, async (req, res) => {
    await instCuenta.find().sort({date: 'desc'})
    .then(documentos => {
            const contexto = {
                instCuenta: documentos.map(documento => {
                    return{
                        id: documento.id,
                        nombre: documento.nombre,
                        date: documento.date.toISOString().substring(0,10),
                        cantidadSeguidores: documento.cantidadSeguidores,
                        cuentaInstagram: documento.cuentaInstagram
                    }
                })
            }
            res.render('cargadenotas/old-cuentasinst', {instCuenta: contexto.instCuenta})
        })
});

module.exports = router;