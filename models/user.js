const db = require('../config/config');
const bcrypt = require('bcryptjs')

const User= {};

User.getAll = () => {
    const sql =`
    SELECT 
        *
    FROM
        users
    `;
    return db.manyOrNone(sql);
}


User.findByEmail = (correo)=>{
    const sql = `
    SELECT
        u.id,
        u.correo,
        u.nombre,
        u.apellido,
        u.imagen,
        u.telefono,
        u.password,
        u.session_token,
		json_agg(
			json_build_object(
				'id', r.id,
				'nombre', r.nombre,
				'imagen', r.imagen,
				'ruta', r.ruta
			)
		) AS roles
    FROM 
        users AS u
	INNER JOIN
		rol_usuario AS au
	ON
		au.id_usuario = u.id
	INNER JOIN
		roles AS r
	ON
		R.id = au.id_rol
    WHERE
        u.correo = $1
	GROUP BY
		u.id
    `;

    return db.oneOrNone(sql, correo);
}

User.findById = (id, callback) => {
    const sql = `
    SELECT
        id,
        correo,
        nombre,
        apellido,
        imagen,
        telefono,
        password,
        session_token
    FROM 
        users
    WHERE
        id = $1
    `;

    return db.oneOrNone(sql, id).then(user => { callback(null, user) })
}


User.create = async(user) => {

    const hash = await bcrypt.hash(user.password, 10);
    const sql = `
    INSERT INTO 
        users(
            correo,
            nombre,
            apellido,
            telefono,
            imagen,
            password,
            created_at,
            updated_at
        ) 
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.correo,
        user.nombre,
        user.apellido,
        user.telefono,
        user.imagen,
        hash,
        new Date(),
        new Date()
    ]);



}
User.update= (user) =>{
    const sql = `
    UPDATE
        users
    SET
        nombre = $2,
        apellido = $3,
        telefono = $4,
        imagen = $5,
        updated_at=$6
    WHERE
        id = $1
    `;

    return db.none(sql, [
        user.id,
        user.nombre,
        user.apellido,
        user.telefono,
        user.imagen,
        new Date()
    ]);
}

User.updateSessionToken = (id_user, session_token) =>{
    const sql = `
    UPDATE
        users
    SET
        session_token =$2
    WHERE
        id = $1
    `;

    return db.none(sql, [
        id_user,
        session_token
    ]);
}

module.exports = User;