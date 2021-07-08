const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    nombre: {type: String, required: true},
    cantidadSeguidores: { type: Number, required: true},
    cuentaInstagram: {type: String, required: true},
    status: {type: Boolean, default: false},
    user: {type: String}
})



module.exports = mongoose.model( 'instCuenta' ,TaskSchema);