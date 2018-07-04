const express = require('express');

const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const { verificatoken, verificaAdmin_Role } = require('../middlewares/autenticacion');


const app = express();

//--------------------------------------------------------------------------------
// Mostrar todas los productos
//--------------------------------------------------------------------------------
app.get('/producto', verificatoken, (req,res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible:true})
                .sort('producto')
                .skip(desde)
                .limit(limite)
                .populate('usuario', 'nombre email')
                .populate('categoria', 'descripcion')   
                .exec( (err,producto) => {

                if (err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                
                Producto.count({disponible: true},(err,conteo) => {
                     
                    res.json({

                        ok: true,
                        producto,
                        cuantos: conteo
                    });
                });

            });    

});

//--------------------------------------------------------------------------------
// Mostrar una producto por ID
//--------------------------------------------------------------------------------
app.get('/producto/:id', verificatoken, (req,res) => { 
    
    // regresar id
    let idProducto = req.params.id;

    Producto.findById(idProducto)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err,productoDB)=> {

            if (err){

                return res.status(500).json({
                            
                ok: false,
                err 

                });

            };     
                    
            if (!productoDB){

                return res.status(400).json({
                            
                    ok: false,
                    err: {
                            message: 'ID no es válido'
                         }

                });

            };    

            res.json({

                ok: true,
                producto: productoDB

            });

    });

});

//--------------------------------------------------------------------------------
// Buscar un producto
//--------------------------------------------------------------------------------
app.get('/producto/buscar/:termino', verificatoken, (req,res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec((err, producto) => {

                if(err){

                    return res.status(500).json({
                        ok: false,
                        err
                    })

                };

                res.json({
                    ok: true,
                    producto
                })

            })
});

//--------------------------------------------------------------------------------
// Crear una nuevo producto
//--------------------------------------------------------------------------------
app.post('/producto', verificatoken, (req,res) => {

    // Regresa la nueva categoria
    // req.usuario._id quien crea categoria
    let body = req.body;
        
    let producto = new Producto({
        
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
         

    });

    producto.save( (err, productoDB) => {

        if ( err ) {

            return res.status(500).json({

                ok: false,
                err

            });

        };

        res.status(201).json({

            ok: true,
            producto: productoDB
            
        });

    });

});

//--------------------------------------------------------------------------------
// Crear un nuevo producto
//--------------------------------------------------------------------------------
app.put('/producto/:id', verificatoken, (req,res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
     
        if(err){
           
            return res.status(500).json({
                ok: false,
                err
            });

        };

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: { message: 'EL ID no existe'}
            });
        };

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
   
        productoDB.save( (err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado            
            });

        });
        
    });

});


//--------------------------------------------------------------------------------
// Borrar un producto
//--------------------------------------------------------------------------------
app.delete('/producto/:id', verificatoken, (req,res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if ( err ) {

            return res.status(500).json({
                ok: false,
                err
            });

        };

        if ( !productoDB ) {

            return res.status(400).json({
                ok: false,
                err: { message: 'Producto no existe' }
            });

        };

        productoDB.disponible = false;
        productoDB.save( (err,productoBorrado) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            });

        });
        

    });

});
    
    

module.exports = app;