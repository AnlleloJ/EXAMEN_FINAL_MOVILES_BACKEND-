const ProductsController = require('../controllers/productController');
const passport = require('passport');

module.exports = (app, upload) => {

    //obtener
    app.get('/api/products/findByCategory/:id_categoria', passport.authenticate('jwt', {session: false}), ProductsController.findByCategory);


    //añadir
    app.post('/api/products/create', passport.authenticate('jwt', {session: false}), upload.array('image', 3), ProductsController.create);
}


