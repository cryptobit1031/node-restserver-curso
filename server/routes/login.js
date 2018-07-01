'use strict'

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/usuario');
const { verificatoken } = require('../middlewares/autenticacion');

const app = express();

app.post('/login', (req,res) => {

    let body = req.body;
    // Utilizamos el fineOne por que nos interesa que traiga solo uno
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if( err ) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!usuarioDB) {
            return res.status(400).json({

                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }

            });
        }

        // Para verificar si la contraseña hace mash
        if ( !bcrypt.compareSync( body.password, usuarioDB.password )) {

            return res.status(400).json({

                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }

            });

        }

        let token = jwt.sign({
            usuario: usuarioDB,

        }, process.env.SEED,{ expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({

            ok:true,
            usuario: usuarioDB,
            token

        });

    });

});




module.exports = app;