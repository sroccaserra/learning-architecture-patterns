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

export async function createSession(): Promise<Session> {
  const session = new Session(myknex);
  await session.initTransaction();
  return session
}

export async function clearDatabase(): Promise<void> {
  await myknex.raw('delete from allocations');
  await myknex.raw('delete from batches');
  await myknex.raw('delete from order_lines');
}

class Session {
  private knex: Knex;
  public trx: Knex.Transaction;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async initTransaction() {
    this.trx = await this.knex.transaction();
  }

  close() {
    if (this.trx && !this.trx.isCompleted()) {
      this.trx.rollback();
    }
  }
}
