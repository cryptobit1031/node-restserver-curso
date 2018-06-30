require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// referencia de usuario js y sus rutas
app.use( require('./routes/usuario') );


mongoose.connect(process.env.URLDB,(err,res) =>{
    
    if (err) throw err;
    console.log('Base de datos Mongoose ONLINE!!!');

});

app.listen(process.env.PORT, ()=> console.log('Escuchando en el puerto', 3000));




   