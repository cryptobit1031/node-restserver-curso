'use strict'

const express = require('express');
const { verificatoken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

let Categoria = require('../models/categoria');

//--------------------------------------------------------------------------------
// Mostrar todas las cateorias
//--------------------------------------------------------------------------------
app.get('/categoria', verificatoken, (req,res) => {

    Categoria.find({})
             .sort('descripcion')
             .populate('usuario','nombre email')   
             .exec( (err,categoria) => {

                if (err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                
                res.json({
                    ok: true,
                    categoria
                    
                });

                    
            });    

});

//--------------------------------------------------------------------------------
// Mostrar una categoria por ID
//--------------------------------------------------------------------------------
app.get('/categoria/:id', verificatoken, (req,res) => { 
    
    // regresar id
    let idCategoria = req.params.id;

    Categoria.findById(idCategoria, (err,categoriaDB) => {

        if (err){

            return res.status(500).json({
                
                ok: false,
                err 

            });

        };     
        
        if (!categoriaDB){

            return res.status(500).json({
                
                ok: false,
                err: {
                    message: 'ID no es válido'
                }

            });

        };    

        res.json({

            ok: true,
            categoria: categoriaDB

        });

    });

});

//--------------------------------------------------------------------------------
// Crear una nueva categoria
//--------------------------------------------------------------------------------
app.post('/categoria', [ verificatoken ], (req,res) => {

    // Regresa la nueva categoria
    // req.usuario._id quien crea categoria
    let body = req.body;
    let idUsuarioCreaCategoria = req.usuario._id
    console.log(body);
    console.log(idUsuarioCreaCategoria);

    let categoria = new Categoria({

        descripcion: body.descripcion,
        usuario: idUsuarioCreaCategoria


    });

    categoria.save( (err, categoriaDB) => {

        if ( err ) {

            return res.status(500).json({

                ok: false,
                err

            });

        };

        if ( !categoriaDB ) {

            return res.status(400).json({

                ok: false,
                err

            });

        };

        res.json({

            ok: true,
            categoria: categoriaDB,
            usuario: idUsuarioCreaCategoria


        });

    });

});

//--------------------------------------------------------------------------------
// Crear una nueva categoria
//--------------------------------------------------------------------------------
app.put('/categoria/:id', (req,res) => {
    // Actualizar el nombre de la categoria

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true,runValidators: true},(err,categoriaDB) => {
    
        if(err){
           
            return res.status(500).json({
                ok: false,
                err
            });

        };

            res.json({
                ok: true,
                categoriaDB            

        });

    });



});


//--------------------------------------------------------------------------------
// Crear una nueva categoria
//--------------------------------------------------------------------------------
app.delete('/categoria/:id', [verificatoken, verificaAdmin_Role ], (req,res) => {
    // Solo la pueda borrar un administrador
    // Eliminar fisicamente de la bd
    // Categoria.findByIdRemuve(....);
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if ( err ) {

            return res.status(500).json({

                ok: false,
                err

            });

        };

        if ( !categoriaDB ) {

            return res.status(400).json({

                ok: false,
                err: { message: 'ID no existe' }

            });

        };
        
        res.json({

            ok: true,
            message: 'Categoria Borrada'

        });

    });

});
    
    

module.exports = app;