import { canalQueries } from "./canal/queries.js";
import { loggerGlobal } from '../../globalServices/logging/loggerManager.js';

import  GraphQLJSON from 'graphql-type-json';

const resolvers = {

    JSON: GraphQLJSON,
    Query: {
        ...canalQueries
    },
    Mutation: {
        //...canalMutations
    }
}

loggerGlobal.debug('Resolvers:', resolvers);
export { resolvers }