const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {


    // Obtener datos
    app.get('/api/users/getAll', UsersController.getAll);

    //guardar datos
    app.post('/api/users/create', UsersController.register);
    app.post('/api/users/login', UsersController.login);

    //actualizar datos
    //error  401 significa " no autorizado"
    app.put('/api/users/update', passport.authenticate('jwt', {session:false}), upload.array('image', 1), UsersController.update);
    app.put('/api/users/updatewithoutImage',passport.authenticate('jwt', {session:false}), UsersController.updatewithoutImage);
}