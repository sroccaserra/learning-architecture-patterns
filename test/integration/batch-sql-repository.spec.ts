import {expect} from 'chai';
import {Knex} from 'knex';

import {Batch} from '../../src/domain/batch';

import {transaction, clearDatabase} from '../conftest';
import {BatchSqlRepository} from '../../src/infrastructure/batch-sql-repository';

beforeEach(function() {
  return clearDatabase();
});

describe('Batch Repository', function() {
  let trx;

  beforeEach(async function() {
    trx = await transaction();
  });

  afterEach(async function() {
    trx.rollback();
  });

  it('can save a batch', async function() {
    const batch = new Batch("batch1", "RUSTY-SOAPDISH", 100, null);
    const repo = new BatchSqlRepository(trx);

    await repo.add(batch);

    const result = await trx('batches')
      .select('reference', 'sku', 'purchased_quantity', 'eta');

    expect(result).to.deep.equal([{
      reference: 'batch1',
      sku: "RUSTY-SOAPDISH",
      purchased_quantity: 100,
      eta: null
    }]);
  });

  it('can retrieve a batch with allocations', async function() {
    const orderline_id: number = await insert_order_line(trx);
    const batch1_id = await insert_batch(trx, 'batch1');
    await insert_batch(trx, 'batch2');
    await insert_allocation(trx, orderline_id, batch1_id);

    const repo = new BatchSqlRepository(trx);
    const retrieved = await repo.get('batch1');

    expect(retrieved).to.deep.equal(new Batch('batch1', 'GENERIC-SOFA', 100, null));
  });
});

///
// Setup functions

async function insert_order_line(knex: Knex): Promise<number> {
  const rows = await knex('order_lines').insert({
    orderid: 'order1',
    sku: 'GENERIC-SOFA',
    qty: 12,
  }).returning('id');

  return rows[0];
}

async function insert_batch(knex: Knex, reference: string): Promise<number> {
  const rows = await knex('batches').insert({
    reference: reference,
    sku: 'GENERIC-SOFA',
    purchased_quantity: 100,
    eta: null,
  }).returning('id');

  return rows[0];
}

async function insert_allocation(knex: Knex, orderline_id: number, batch_id: number): Promise<void> {
  return knex('allocations').insert({
    batch_id: batch_id,
    orderline_id: orderline_id,
  });
}
