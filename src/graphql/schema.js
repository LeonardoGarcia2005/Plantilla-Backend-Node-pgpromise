import { readdirSync, readFileSync } from 'fs';
import {resolvers} from './resolvers/indexResolvers.js'
import { loggerGlobal } from '../globalServices/logging/loggerManager.js';
import { buildSchema } from 'graphql';

let typeDefs = '';

const gqlFiles = readdirSync(new URL('./typeDefs',import.meta.url));
console.log(gqlFiles)

gqlFiles.forEach((file) => {
  loggerGlobal.debug('el archivo iterado es: '+file);
  const archivo = new URL('./typeDefs/'+file,import.meta.url);
  //console.log('archivo es: '+archivo);
  typeDefs += readFileSync(archivo, {
      encoding: 'utf8',
  });
});

try {
  buildSchema(typeDefs);
  console.log('El esquema es válido');
} catch (error) {
  console.error('Error en el esquema:', error);
}
//console.log('typedefs es: '+typeDefs);

const resolversGot = resolvers;

const schema={
    typeDefs:typeDefs,
    resolvers:resolversGot,
 };

 //export default schema;
 export {schema};



