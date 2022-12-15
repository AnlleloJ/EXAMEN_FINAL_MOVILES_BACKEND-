--
--pruebas inicio de roles
-- SELECT
--         u.id,
--         u.correo,
--         u.nombre,
--         u.apellido,
--         u.imagen,
--         u.telefono,
--         u.password,
--         u.session_token,
-- 		json_agg(
-- 			json_build_object(
-- 				'id', r.id,
-- 				'nombre', r.nombre,
-- 				'imagen', r.imagen,
-- 				'ruta', r.ruta
-- 			)
-- 		) AS roles
--     FROM 
--         users AS u
-- 	INNER JOIN
-- 		rol_usuario AS au
-- 	ON
-- 		au.id_usuario = u.id
-- 	INNER JOIN
-- 		roles AS r
-- 	ON
-- 		R.id = au.id_rol
--     WHERE
--         u.correo = 'prueba1@gmail.com'
-- 	GROUP BY
-- 		u.id

--fin pruebas
--
--
CREATE TABLE roles (
	id  BIGSERIAL PRIMARY KEY,
	nombre VARCHAR(180) NOT NULL UNIQUE,
	imagen VARCHAR(255) NULL,
	ruta VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS users CASCADE;
create table users(
	id BIGSERIAL PRIMARY KEY,
	correo VARCHAR(255) NOT NULL unique,
	nombre varchar(255) NOT NULL,
	apellido VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	imagen VARCHAR(255) null,
	password VARCHAR(255) NOT NULL,
	esta_disponible BOOLEAN null,
	session_token VARCHAR(255)NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS rol_usuario CASCADE;
CREATE TABLE rol_usuario(
	id_usuario BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_usuario) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_usuario, id_rol)
);

drop table if exists categories cascade;
CREATE TABLE categories(
	id BIGSERIAL PRIMARY KEY,
	nombre VARCHAR(180) not null unique,
	imagen varchar(255) not null,
	created_at timestamp(0) not null,
	updated_at timestamp(0) not null
);


drop table if exists categories cascade;

create table products(

	id BIGSERIAL PRIMARY KEY,
	nombre varchar(180) not null unique,
	descripcion varchar(255) not null,
	precio decimal default 0,
	imagen1 varchar(255) null,
	imagen2 varchar(255) null,
	imagen3 varchar(255) null,
	id_categoria BIGINT not null,
	created_at timestamp(0) not null,
	updated_at timestamp(0) not null,

	FOREIGN KEY(id_categoria) REFERENCES categories(id) on UPDATE cascade on delete cascade
);

//metodo consulta productos por id_categoria
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
	C.id = 3
	//fin metodo

