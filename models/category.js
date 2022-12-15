const db = require('../config/config');

const Category = {};

Category.getAll = () => {
    const sql = `
    SELECT
        id,
        nombre,
        imagen
    FROM
        categories
    ORDER BY
        nombre
`;
return db.manyOrNone(sql);

}


Category.create = (category) => {
    const sql = `
    INSERT INTO
        categories(
            nombre,
            imagen,
            created_at,
            updated_at
        )
    VALUES($1,$2,$3,$4) RETURNING id
    `;
    return db.oneOrNone( sql, [
        category.nombre,
        category.imagen,
        new Date(),
        new Date()

    ]);
}

module.exports = Category;
