const { getAll } = require('../models/category');
const Category = require('../models/category');
const storage = require('../utils/cloud_storage');

module.exports= {
    async create(req, res, next){

        console.log('REQ BODY', req.body);
        
        try{
            const category = JSON.parse(req.body.category);
            console.log('Category', category);

            //--------------------------------
            const files = req.files;
            if(files.length > 0){ //significa que l usuario nos envia un archivo/imagen

                const pathImage = `image_${Date.now()}`; //esto es el nombre del archivo

                const url = await storage(files[0], pathImage); //esto es la url de firebase, aqui significa que solamente nos permite enviar 1 solo archivo

                if(url != undefined && url !=null){
                    category.imagen = url;
                }
            }
            //-------------------------------



            const data = await Category.create(category);


            return res.status(201).json({
                success: true,
                message: 'La categoría se ha creado correctamente.',
                data: {
                    'id':data.id
                }
            });



        }catch(error){

            console.log('error', error);

            return res.status(501).json ({
                
                success: false,
                message: 'Hubo un error al crear la categoría.',
                error :error
            });
        }
    },

    async getAll(req, res, next){
        try {

            const data = await Category.getAll();

            return res.status(201).json(data);

        }catch(error){

            console.log('error', error);

            return res.status(501).json ({
                
                success: false,
                message: 'Hubo un error al crear la categoría.',
                error :error
            });
        }



    }
}
