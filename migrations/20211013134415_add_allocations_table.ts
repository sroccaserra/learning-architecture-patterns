import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('allocations', function (table) {
    table.increments('id').unsigned().primary();
    table.integer('orderline_id').unsigned().references('order_lines.id');
    table.integer('batch_id').unsigned().references('batches.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('allocations');
}
