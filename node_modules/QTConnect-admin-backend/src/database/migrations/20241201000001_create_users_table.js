/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.enum('role', ['admin', 'user']).defaultTo('user').notNullable();
    table.enum('status', ['active', 'inactive']).defaultTo('active').notNullable();
    table.string('emailHash', 96).nullable(); // SHA-384 produces 96 character hex string
    table.text('signature').nullable(); // Store the digital signature
    table.string('createdAt').notNullable(); // createdAt and updatedAt
    table.string('updatedAt').notNullable(); // createdAt and updatedAt
    
    // Indexes for better performance
    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
    table.index(['createdAt']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
