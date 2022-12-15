const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
//const passport = require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

//habilitamos valores exportables
module.exports = {
    async getAll(req, res, next){
        try{
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        }
        catch (error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuarios.'
            });

        }
    },

    async register(req,res,next){
        try{
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1);

            const token = jwt.sign({ id: data.id,correo: user.correo }, keys.secretOrKey, {
                //expiresIn
            })

            const myData = {
                id: data.id,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                telefono: user.telefono,
                imagen: user.imagen,
                session_token: `JWT ${token}`
            };

            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente.',
                data:myData
            });
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario.',
                error: error

            });

        }
    },

    async login(req,res,next){
        try{
            const correo=req.body.correo;
            const password = req.body.password;

            const myUser = await User.findByEmail(correo);

            //En caso no se devuelva el usuario.
            if (!myUser){
                return res.status(401).json({
                    success: false,
                    message: 'El correo no fue encontrado.'
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if(isPasswordValid){
                const token = jwt.sign({ id: myUser.id,correo: myUser.correo }, keys.secretOrKey, {
                    //expiresIn
                });

                const data = {
                    id: myUser.id,
                    nombre: myUser.nombre,
                    apellido: myUser.apellido,
                    correo: myUser.correo,
                    telefono: myUser.telefono,
                    imagen: myUser.imagen,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }

                await User.updateSessionToken(myUser.id, `JWT ${token}`);

               // console.log(`Usuario enviado ${data}`);

                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'El usuario ha sido autenticado.'
                    
                });

            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta.',
                });
            }


        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al iniciar sesión.',
                error: error
            });
        }

    },
//actualizar
    async update(req, res, next){
        try{

            console.log('Usuario', req.body.user);

            const user = JSON.parse(req.body.user); //significa que el cliente debe enviarnos un objeto con todos los datos del usuario.
            console.log('Usuario parseado', user);

            const files = req.files;


            if(files.length > 0){ //significa que l usuario nos envia un archivo/imagen
                const pathImage = `image_${Date.now()}`; //esto es el nombre del archivo
                const url = await storage(files[0], pathImage); //esto es la url de firebase, aqui significa que solamente nos permite enviar 1 solo archivo

                if(url != undefined && url !=null){
                    user.imagen = url;
                }
            }

            /*
            * User es el modelo
            * user es la constante
            */
            await User.update(user); //el metodo update actualiza los datos y aqui nos permiten guardar la url en la base de datos

            return res.status(201).json({
                success: true,
                message: 'Los datos se han actualizado correctamente.',
                data: user
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar los datos del usuario.',
                error: error
            });
        }
    },
//actualizar sin imagen
    async updatewithoutImage(req, res, next){
        try{

            console.log('Usuario', req.body);

            const user = req.body; //significa que el cliente debe enviarnos un objeto con todos los datos del usuario.
            console.log('Usuario parseado', user);
            /*
            * User es el modelo
            * user es la constante
            */
            await User.update(user); //el metodo update actualiza los datos y aqui nos permiten guardar la url en la base de datos

            return res.status(201).json({
                success: true,
                message: 'Los datos se han actualizado correctamente.',
                data: user
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar los datos del usuario.',
                error: error
            });
        }
    }
};