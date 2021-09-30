import { expect } from 'chai';
import { knex } from '../../src/infrastructure/database';

after(function() {
  knex.destroy();
});

describe('Database connection', function() {
  it('can load data', async function() {
    const query = 'select 1 as n;';

    const result = await knex.raw(query);

    expect(result.rows).to.deep.equal([{n: 1}]);
  })
})
