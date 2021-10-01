import {Batch} from '../batch';
import {BatchRepository} from '../batch-repository';
import {knex} from './database';

export class BatchSqlRepository implements BatchRepository {
  async add(batch: Batch): Promise<void> {
    const state = batch.getState();

    return knex('batches').insert({
        reference: state.ref,
        sku: state.sku,
        purchased_quantity: state.purchased_quantity,
        eta: state.eta,
      });
  }
}
