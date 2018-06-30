'use strict'



process.env.PORT = process.env.PORT || 3000;


// ------------------------------------------------------------------------------------------------
// Entorno
// ------------------------------------------------------------------------------------------------


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';





// ------------------------------------------------------------------------------------------------
// Base de datos
// ------------------------------------------------------------------------------------------------
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else {
    urlDB = 'mongodb://cafe-user:123456Mcuello0@ds123981.mlab.com:23981/cafe-db';
}

process.env.URLDB = urlDB;