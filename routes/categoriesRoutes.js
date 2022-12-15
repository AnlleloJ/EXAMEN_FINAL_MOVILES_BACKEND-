const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {


    // Obtener datos
    app.get('/api/categories/getAll', passport.authenticate('jwt', {session:false}), CategoriesController.getAll);

    //guardar datos
    app.post('/api/categories/create', passport.authenticate('jwt', {session:false}), upload.array('image', 1), CategoriesController.create);
    // app.post('/api/users/login', UsersController.login);

    //actualizar datos
    //error  401 significa " no autorizado"
    // app.put('/api/users/update', passport.authenticate('jwt', {session:false}), upload.array('image', 1), UsersController.update);
    // app.put('/api/users/updatewithoutImage',passport.authenticate('jwt', {session:false}), UsersController.updatewithoutImage);
}