import knex from 'knex'

import knexConfigurations from '../../knexfile';

const node_env = process.env.NODE_ENV || 'development';
const config = knexConfigurations[node_env];

const myknex = knex(config);

export {myknex as knex};

export async function clearDatabase(): Promise<void> {
  await myknex.raw('delete from allocations');
  await myknex.raw('delete from batches');
  await myknex.raw('delete from order_lines');
}
