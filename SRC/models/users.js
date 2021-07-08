const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
    },
    {
    timestamps: true,
    versionKey: false,
    }

);

UserSchema.methods.encryptPassword = (password) => {
    const salt =  bcrypt.genSaltSync(10);
    const hash =  bcrypt.hashSync(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);