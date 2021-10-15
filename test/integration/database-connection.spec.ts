import {expect} from 'chai';

import {createSession} from '../conftest';

describe('Database connection', function() {
  let session;

  beforeEach(async function() {
    session = await createSession();
  });

  afterEach(async function() {
    session.close();
  });

  it('can load data', async function() {
    const query = 'select 1 as n;';

    const result = await session.trx.raw(query);

    expect(result.rows).to.deep.equal([{n: 1}]);
  });
});
