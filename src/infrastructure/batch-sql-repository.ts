import {Batch} from '../domain/batch';
import {BatchRepository} from '../domain/batch-repository';
import {knex} from './database';

export class BatchSqlRepository implements BatchRepository {
  async add(batch: Batch): Promise<void> {
    const state = batch.getState();
    return knex('batches').insert(state);
  }

  async get(reference: string): Promise<Batch> {
    const data = await knex('batches').where({reference: reference}).first();
    return Batch.fromState(data);
  }
}
