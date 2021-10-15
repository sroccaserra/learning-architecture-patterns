import {Knex} from 'knex';

import {Batch} from '../domain/batch';
import {BatchRepository} from '../domain/batch-repository';

export class BatchSqlRepository implements BatchRepository {
  private knex: Knex

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async add(batch: Batch): Promise<void> {
    const state = batch.getState();
    return this.knex('batches').insert(state);
  }

  async get(reference: string): Promise<Batch> {
    const data = await this.knex('batches').where({reference: reference}).first();
    return Batch.fromState(data);
  }
}
