import knex from 'knex'

import knexConfigurations from '../knexfile';

const myknex = knex(knexConfigurations.test);

export {myknex as knex};

export async function clearDatabase(): Promise<void> {
  await myknex.raw('delete from allocations');
  await myknex.raw('delete from batches');
  await myknex.raw('delete from order_lines');
}
