import { Canal } from '../../../models/businessLogic/canalService.js';

const canalQueries = {
  canal: async (_, {id}) => {
      return await Canal.consultaCanal(id);
  },
};

export {canalQueries};
