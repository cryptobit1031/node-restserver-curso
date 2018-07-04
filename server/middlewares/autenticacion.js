'use strict'

const jwt = require('jsonwebtoken');

// ------------------------------------------------------------------------------------------------
// Verificar token: implemetamos un middleware peromalizado para verificar el token
// ------------------------------------------------------------------------------------------------
let verificatoken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no es válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

// ------------------------------------------------------------------------------------------------
// Verifica token: implemetamos un middleware peromalizado para verificar el token cuando una imagen
//                 sea llamada desde una url.
// ------------------------------------------------------------------------------------------------
let verificatokenImgUrl = (req, res, next) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no es válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
   
    if ( usuario.role === 'ADMIN_ROLE') {
        
        next();
    
    }else{

        return res.json({
            ok: false,
            err: {
                message: 'Usuario no tiene derechos administrativos'
            }
        });    

    };  

};

module.exports = {
    verificatoken,
    verificaAdmin_Role,
    verificatokenImgUrl
}
