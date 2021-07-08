const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const roleSchema = new Schema({
    nombre: {type: String}
    },
    {
    timestamps: true,
    versionKey: false,
    }

);
module.exports = mongoose.model('Role', roleSchema);