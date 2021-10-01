import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('batches', function (table) {
    table.increments('id').unsigned().primary();
    table.string('reference', 255);
    table.string('sku', 255);
    table.integer('purchased_quantity').notNullable();
    table.date('eta').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('batches');
}
