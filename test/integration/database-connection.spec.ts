import { expect } from 'chai';
import knex from 'knex'

import knexConfiguration from '../../knexfile';
const myknex = knex(knexConfiguration['test']);

after(function() {
  myknex.destroy();
});

describe('Database connection', function() {
  it('can load data', async function() {
    const query = 'select 1 as n;';

    const result = await myknex.raw(query);

    expect(result.rows).to.deep.equal([{n: 1}]);
  })
})
