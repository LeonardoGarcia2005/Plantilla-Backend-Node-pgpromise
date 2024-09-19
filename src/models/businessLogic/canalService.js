import { canalDAO } from '../dataAccessObjects/canalDAO.js';


const consultaCanal = async (id) => {
  return canalDAO.consultarCanal(id)
};

const Canal = {
  consultaCanal
};

export { Canal}
