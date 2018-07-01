'use strict'

const express = require('express');
// ----------------------------------------------------------------------------------------------------------------------
// Con bcrypt nos aayuda a encryptar    en una sola vía
const bcrypt = require('bcrypt');
// ----------------------------------------------------------------------------------------------------------------------
const _ =require('underscore');

const Usuario = require('../models/usuario');
const { verificatoken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();


app.get('/usuario', verificatoken, (req,res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true},'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec( (err,usuarios) => {

                if (err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                
                // Retorna los registros y la cantidad
                Usuario.count({estado:true }, (err,conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo

                    });    
                });    
            });    
  
});



app.post('/usuario',[verificatoken, verificaAdmin_Role], (req,res)=> {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10), 
        role: body.role
    });

    usuario.save( (err,usuarioDB) =>{

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});


// ----------------------------------------------------------------------------------------------------------------------
// Actualizacion de rtegistros
// ----------------------------------------------------------------------------------------------------------------------
app.put('/usuario/:id', [verificatoken, verificaAdmin_Role], (req,res)=> {

    let id = req.params.id;
    
// ----------------------------------------------------------------------------------------------------------------------
// Pick regresa una copia del objeto filtrando solo los valores que yo quiero --> npm install underscore
// ----------------------------------------------------------------------------------------------------------------------
    let body = _.pick( req.body,['nombre','email','img','role','estado'] );
// ----------------------------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------------------------
// runValidators: if true, runs update validators on this command. Update validators validate the update operation against 
// the model's schema.
// ----------------------------------------------------------------------------------------------------------------------
    Usuario.findByIdAndUpdate(id,body,{new: true,runValidators: true},(err,usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };

            res.json({
                ok: true,
                usuarioDB            

        });

    }); 

});

// ----------------------------------------------------------------------------------------------------------------------
app.delete('/usuario/:id', verificatoken, (req,res) => {

// ----------------------------------------------------------------------------------------------------------------------
// De esta forma mofificamos el registro de estado
// ----------------------------------------------------------------------------------------------------------------------

    let id = req.params.id;
   
    Usuario.findByIdAndUpdate(id,{estado: false},{new: true},(err,usuarioBorrado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            usuarioBorrado
        });
    });

/*
// ----------------------------------------------------------------------------------------------------------------------
// De esta forma borramos físicamente un registro
// ----------------------------------------------------------------------------------------------------------------------

    let id = req.params.id;

    Usuario.findByIdAndRemove(id,(err, usuarioBorrado) => {
       
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };


        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
    */

});


module.exports = app;