import {expect} from 'chai';

import {Batch} from '../../src/batch';

import {knex, clearDatabase} from '../../src/infrastructure/database';
import {BatchSqlRepository} from '../../src/infrastructure/batch-sql-repository';

beforeEach(function() {
  return clearDatabase();
});

describe('Batch Repository', function() {
  it('can save a batch', async function() {
    const batch = new Batch("batch1", "RUSTY-SOAPDISH", 100, null);
    const repo = new BatchSqlRepository();

    await repo.add(batch);

    const result = await knex('batches')
      .select('reference', 'sku', 'purchased_quantity', 'eta');

    expect(result).to.deep.equal([{
      reference: 'batch1',
      sku: "RUSTY-SOAPDISH",
      purchased_quantity: 100,
      eta: null
    }]);
  });
});
