const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');


module.exports = {

    async findByCategory(req, res, next) {
        try{
            const id_categoria = req.params.id_categoria; 
            const data = await Product.findByCategory(id_categoria);

            return res.status(201).json(data);

        }catch(error){
            console.log('Error: ${error}');
            return res.status(501).json({
                message: `Error al listar los productos por categoría.`,
                success: false,
                error: error
            });

        }
    },

    async create(req, res, next){
        let product =JSON.parse(req.body.product);
        const files = req.files;
        let inserts = 0;

        if(files.length === 0) { //en caso de ser igual a 0 retornamos el error
            return res.status(501).json({
                message: 'error al registrar el producto, no tiene imagen.',
                success: false
            });

        }
        else{
            try{
                const data = await Product.create(product);
                product.id =data.id;

                const start = async () => {
                    await asyncForEach(files,async(file)=>{
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);

                        if(url !== undefined && url !== null) {
                            if(inserts ==0){ //primera imagen
                                product.imagen1 = url;
                            }
                            else if(inserts ==1){ //segunda imagen
                                product.imagen2 = url;
                            }
                            else if(inserts ==2){ // tercera imagen de las categorias
                                product.imagen3 = url;
                            }
                        }

                        await Product.update(product);
                        inserts = inserts + 1;

                        if(inserts == files.length){
                            return res.status(201).json ({
                                success: true,
                                message: 'El producto se registró correctamente.'
                            });
                        }
                    });
                }

                start();

            }catch(error){
                console.log('Error: ${error}');
                return res.status(501).json({
                    message: `Error al registrar el producto ${error}`,
                    success: false,
                    error: error

                });
            }
        }

    }
}
