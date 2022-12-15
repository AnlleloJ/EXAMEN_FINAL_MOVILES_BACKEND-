const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

/*
* Declaramos las rutas
*/
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require ('./routes/ProductsRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

/*
* llamando rutas
*/
users(app,upload);
categories(app,upload);
products(app, upload);

server.listen(3000, '192.168.1.28' || 'localhost', function() {
    console.log('Aplicación con NodeJs '+ port + ' iniciada.')
});




//manejo de errores
// reepcion de valor 200 es recepción exitosa.
//404 es error.
//500 error interno de codigo.
app.use((err, req, res, next) =>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

//sirve para exportar variables a otros archivos
module.exports = {
    app: app,
    server:server
}