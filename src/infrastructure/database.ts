import knex from 'knex'

import knexConfigurations from '../../knexfile';

const node_env = process.env.NODE_ENV || 'development';
const config = knexConfigurations[node_env];

const myknex = knex(config);

export {myknex as knex};
