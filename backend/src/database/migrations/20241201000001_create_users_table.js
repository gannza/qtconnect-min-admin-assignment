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
    table.string('email_hash', 96).nullable(); // SHA-384 produces 96 character hex string
    table.text('digital_signature').nullable(); // Store the digital signature
    table.timestamps(true, true); // createdAt and updatedAt
    
    // Indexes for better performance
    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
