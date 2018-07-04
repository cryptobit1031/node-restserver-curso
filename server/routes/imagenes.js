'use strict'


const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificatokenImgUrl } = require('../middlewares/autenticacion');

let app = express();


app.get('/imagen/:tipo/:img', verificatokenImgUrl, (req,res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    // --------------------------------------------------------------------------------------
    // Nota : senFile require realizar un path absoluto de la imagen. Por ello importamos
    //        const path = require('path'); y definimos el path con path.resolve.
    // --------------------------------------------------------------------------------------
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if(fs.existsSync( pathImagen ) ){
        res.sendFile(pathImagen);
    }else{
        let ImagenPathAbsolute = path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(ImagenPathAbsolute);
    }

});



module.exports = app;