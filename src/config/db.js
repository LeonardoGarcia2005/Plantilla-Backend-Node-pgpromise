import 'dotenv/config';  // Esto carga las variables de entorno de .env
import pgPromise from 'pg-promise';

// Configuración de la conexión a la base de datos
const connection = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10), // Asegúrate de convertir el puerto a número
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

//Inicializacion del pg-promise
const pgp = pgPromise({
    capSQL: true, // Habilita la capacidad de SQL
    query(e) {
        console.debug('QUERY: ' + e.query);
    },
    error(error, e) { //Un hook que maneja los errores que ocurren durante la ejecución de una consulta. Imprime el error y, si está disponible, la consulta que causó el error.
        console.error('Error en la base de datos:', error);
        if (e.query) {
            console.error('Query con error:', e.query);
        }
    },
    receive(e) {
        //Un hook que se ejecuta después de que se reciben los resultados de una consulta. Imprime la cantidad de filas retornadas.
        console.info('Cantidad de filas retornadas:', e.result.rowCount);
    }
});

// Crear la instancia de la base de datos
let db;
try {
    db = pgp(connection);
    console.debug('Logré crear el objeto db con la configuración del sistema ...');
} catch (error) {
    console.error('Error al tratar de crear la conexión a la base de datos:', error);
}


// Funciones de consulta
//Verifica la conexión a la base de datos. Intenta obtener una conexión y devuelve 
//la versión del servidor de la base de datos si la conexión es exitosa. Si ocurre un error, se captura y se devuelve null.
async function verificarConexionBD() {
    try {
        const c = await db.connect();
        c.done(); // Libera la conexión
        return c.client.serverVersion;
    } catch (error) {
        console.error('Error al conectarse a la BD:', error);
        return null;
    }
}


//Ejecuta una consulta que debe devolver exactamente una fila. Lanza un error si no se encuentra ninguna fila o si se encuentran múltiples.
async function onePgMethod(query, values) {
    return db.one(query, values);
}


//Ejecuta una consulta que puede devolver una fila o ninguna. Lanza un error si se encuentran múltiples filas.
async function oneOrNonePgMethod(query, values) {
    return db.oneOrNone(query, values);
}

//Ejecuta una consulta que puede devolver múltiples filas o ninguna. No lanza un error si no se encuentran filas.
async function manyOrNonePgMethod(query, values) {
    return db.manyOrNone(query, values);
}


//Ejecuta una consulta que debe devolver múltiples filas. Lanza un error si no se encuentran filas.
async function manyPgMethod(query, values) {
    return db.many(query, values);
}

//Ejecuta una consulta que se utiliza para concatenar los resultados. Es útil para operaciones específicas que requieren concatenación de resultados.
async function concatPgMethod(query, values) {
    return db.concat(query, values);
}


//aneja una transacción de base de datos. Permite ejecutar múltiples consultas dentro de una transacción y 
//asegura que todas las consultas se ejecuten correctamente antes de confirmar la transacción. Captura y maneja errores durante la transacción.
async function txPgMethod(args, cb) {
    try {
        return await db.tx(args, cb);
    } catch (error) {
        console.error('Error en la transacción:', error);
        return error;
    }
}


// Maneja una tarea de base de datos que puede incluir varias consultas. 
//Permite agrupar consultas bajo una tarea que puede ser gestionada y manejada como una unidad. Captura y maneja errores durante la tarea.
async function taskPgMethod(args, cb) {
    try {
        return await db.task(args, cb);
    } catch (error) {
        console.error('Error en la tarea:', error);
        return error;
    }
}

// Exportar el proveedor de conexión

// Proporciona un objeto que encapsula las funciones y propiedades necesarias para interactuar con la base de datos usando pg-promise
const dbConnectionProvider = {
    helpers: pgp.helpers,
    pgpErrors: pgp.errors,
    one: onePgMethod,
    manyOrNone: manyOrNonePgMethod,
    many: manyPgMethod,
    oneOrNone: oneOrNonePgMethod,
    concat: concatPgMethod,
    tx: txPgMethod,
    task: taskPgMethod,
    verificarConexionBD: verificarConexionBD,
};

export { dbConnectionProvider };


