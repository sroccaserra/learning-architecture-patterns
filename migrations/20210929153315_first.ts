import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('order_lines', function (table) {
    table.increments('id').unsigned().primary();
    table.string('sku', 255);
    table.integer('qty').notNullable();
    table.string('orderid', 255);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('order_lines');
}
