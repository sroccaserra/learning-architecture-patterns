import {expect} from 'chai';

import {transaction} from '../conftest';

describe('Database connection', function() {
  let trx;

  beforeEach(async function() {
    trx = await transaction();
  });

  afterEach(async function() {
    trx.rollback();
  });

  it('can load data', async function() {
    const query = 'select 1 as n;';

    const result = await trx.raw(query);

    expect(result.rows).to.deep.equal([{n: 1}]);
  });
});
