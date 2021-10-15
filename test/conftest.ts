import knex from 'knex';
import {Knex} from 'knex';

import knexConfigurations from '../knexfile';

const myknex = knex(knexConfigurations.test);

after(function() {
  myknex.destroy();
});

export async function transaction(): Promise<Knex.Transaction> {
  return myknex.transaction();
}

export async function clearDatabase(): Promise<void> {
  await myknex.raw('delete from allocations');
  await myknex.raw('delete from batches');
  await myknex.raw('delete from order_lines');
}
