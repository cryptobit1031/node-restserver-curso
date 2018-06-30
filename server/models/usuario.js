'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rool válido'
};


let Schema = mongoose.Schema;


let usuarioScheme = new Schema({
    nombre: {
        type: String,
        required: [true,'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'El correo es necesario']
    },
    password: {
        type: String,
        required: [true,'El password es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos    
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
 
});

// ----------------------------------------------------------------------------------------------------------------------
// De esta manera hemos modificado cuando se imprima mediante u toJSON el userSchema.
// ----------------------------------------------------------------------------------------------------------------------
usuarioScheme.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}
// ----------------------------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------------------------
// mongoose-unique-validator: Es un complemento que agrega validación previa a la guardado para campos únicos dentro de un 
// de Mongoose.
usuarioScheme.plugin( uniqueValidator, { message: '{PATH} debe de ser único'});
// ----------------------------------------------------------------------------------------------------------------------


module.exports = mongoose.model( 'Usuario', usuarioScheme );