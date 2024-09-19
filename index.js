import { expressMiddleware } from '@apollo/server/express4';
import pkg1 from 'body-parser';
const { json } = pkg1;
import cors from 'cors';
import { configurationProvider } from './src/globalServices/config/configurationManager.js';
import { dbConnectionProvider } from './src/config/db.js';
import { loggerGlobal } from './src/globalServices/logging/loggerManager.js';
import { app, apolloServer } from './app.js';
import { exit } from 'node:process';

// Puerto del servidor web
const PUERTO_WEB = configurationProvider.services.port;
loggerGlobal.debug(`Tengo el puerto web: ${PUERTO_WEB}`);

try {
    loggerGlobal.info('Iniciando el Apollo Server...');
    await apolloServer.start();
} catch (error) {
    loggerGlobal.error('Error al iniciar el servidor GraphQL; No se podrá iniciar el sistema...', error);
    exit(-1);
}

//configuracion de cors para que no ocurra el conflicto de los dos puertos distintos
const corsOptions = {
    origin: [
        "http://localhost:5173",

    ],
    credentials: true,
    allowedHeaders: ['sessionID', 'content-type', 'authorization'],  // Agrega esta línea para permitir el encabezado Authorization
};

// Configura el límite de tamaño para el middleware `json`
const jsonParser = json({ limit: '50mb' }); // Ajusta el límite según sea necesario


app.use(
    '/graphql',
    cors(corsOptions),
    
    jsonParser,
    expressMiddleware(apolloServer, {
        context: async ({ req }) => {
            return {
                session: req.session,
                // Puedes añadir otras propiedades del contexto aquí si es necesario
            };
        },
    }),
);
// Iniciar el servidor Express
app.listen(PUERTO_WEB, () => {
    loggerGlobal.info(`🚀 Server listo en http://localhost:${PUERTO_WEB}/graphql`);
});
