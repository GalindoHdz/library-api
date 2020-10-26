// Modules
import { gql } from 'apollo-server-express';
import { Objects } from './objects';
import { Queries } from './queries';
import { Inputs } from './inputs';
import { Mutations } from './mutations';
import { Enums } from './enums';

// Definition of Types
export const typeDefs = gql`
    ${Objects()}
    ${Enums()}
    ${Inputs()}
    ${Queries()}
    ${Mutations()}
`;
