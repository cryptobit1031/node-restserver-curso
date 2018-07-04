const express       = require('express');
const fileUpload    = require('express-fileupload');
const app           = express();

const Usuario       = require('../models/usuario');
const Producto      = require('../models/producto');
const fs            = require('fs');
const path          = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id',(req, res) => {

    let tipo = req.params.tipo;
    let id= req.params.id;
   
    if (!req.files){

        return res.status(400)
           .json({
                ok: false,
                err: { message: 'No se ha selecionado ningún archivo'}
            });

    };

    // Tipos Validos
    let tiposValidos = ['productos','usuarios'];
    if (tiposValidos.indexOf(tipo) < 0 ) {

        return res.status(400).json({
            ok: false,
            err: {message: 'Los tipos permitidos son:  ' + tiposValidos}
        });

    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {message: ` La ${extension} no es válida. Use : `  +` ${extensionesValidas}` }, 
            ext: extension
        });

    }

//--------------------------------------------------------------------------------
// Cambiar nombre al archivo para que sea único
//--------------------------------------------------------------------------------
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
  
        archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => { 

            if (err)
                return res.status(500).json({
                ok: false,      
                err
            });
            if(tipo === 'usuarios'){
                imagenUsuario(id,res,nombreArchivo);
            }else{
                imagenProducto(id,res,nombreArchivo);
            }
            
            });    
    });    

function imagenUsuario(id, res,nombreArchivo){

    Usuario.findById(id, (err,usuarioDB) => {

        if(err){ 
            borraArchivo('usuarios',nombreArchivo);
            return res.status(500).json({ 
                ok: false,
                err
            });
        };

        if (!usuarioDB) {
            borraArchivo('usuarios',nombreArchivo);
            return res.status(400).json({
                ok: false,
                err
            });
        };

        borraArchivo('usuarios',usuarioDB.img);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });

}

function imagenProducto(id,res,nombreArchivo){

    Producto.findById(id,(err,productoDB) => {

        if (err) {
            borraArchivo('productos',nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            borraArchivo('productos',nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {message: `No existe este ${id} de producto en base de datos`}
            });
        };
        
        borraArchivo('productos',productoDB.img);

        productoDB.img = nombreArchivo;
        productoDB.save((err,productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });

}

function borraArchivo(tipo,nombreImagen){
         
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
            if (fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }

}

module.exports = app;