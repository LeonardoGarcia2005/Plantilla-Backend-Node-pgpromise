import {dbConnectionProvider} from '../../config/db.js'; 
import {FabricaErrores} from '../errors/errorsManager.js'
import { loggerGlobal } from '../../globalServices/logging/loggerManager.js';


const consultarCanal = async(id) =>{

    try
    {
        const values = [id];
        const query = `SELECT       id,nombre,estado,fecha_creacion,fecha_desactivacion
                        FROM        canal_carga
                        WHERE       id =${id}`;

        const respuesta = await dbConnectionProvider.oneOrNone(query,values);
        loggerGlobal.debug('Respuesta en el metodo consultaCanal de canalDAO: ');
        loggerGlobal.debug(respuesta);
        return respuesta;

    }catch(errorConsulta){
        if (errorConsulta instanceof dbConnectionProvider.pgpErrors.QueryResultError)
        {
            if (errorConsulta.code === dbConnectionProvider.pgpErrors.queryResultErrorCode.noData){
                throw FabricaErrores.crearError(
                    FabricaErrores.TipoError.ErrorDatosNoEncontrados,
                    'No se encontro el canal con Id '+id,
                    errorConsulta);
            }
        }
        throw errorConsulta;
    }
}


const canalDAO = {
    consultarCanal:consultarCanal
}

export { canalDAO }