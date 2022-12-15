const db = require('../config/config');

const Product = {}; //objeto vacio

Product.findByCategory = (id_categoria) => {
    const sql = `
    SELECT
        P.id,
        P.nombre,
        P.descripcion,
        P.precio,
        P.imagen1,
        P.imagen2,
        P.imagen3,
        P.id_categoria
    FROM
        products AS P
    INNER JOIN
        categories AS C
    ON
        P.id_categoria = C.id
    WHERE
        C.id = $1
    `;
    return db.manyOrNone(sql, id_categoria); //debemos obtener muchos o ningun valor al realizar la consulta
}



Product.create = (product) => { //metodo para almacenar valores 
    const sql = `
    INSERT INTO
        products(
            nombre,
            descripcion,
            precio,
            imagen1,
            imagen2,
            imagen3,
            id_categoria,
            created_at,
            updated_at    
        )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
    `;
    return db.oneOrNone(sql, [ //retorna 1 o ningun valor
        product.nombre,
        product.descripcion,
        product.precio,
        product.imagen1,
        product.imagen2,
        product.imagen3,
        product.id_categoria,
        new Date(),
        new Date()
    ]);
}

Product.update =(product) => {
    const sql = `
    UPDATE
        products
    SET
        nombre = $2,
        descripcion = $3,
        precio = $4,
        imagen1 = $5,
        imagen2 = $6,
        imagen3 = $7,
        id_categoria = $8,
        updated_at = $9
    WHERE
        id = $1
    `;

    return db.none(sql, [
        product.id,
        product.nombre,
        product.descripcion,
        product.precio,
        product.imagen1,
        product.imagen2,
        product.imagen3,
        product.id_categoria,
        new Date()
    ]);
}

module.exports = Product;