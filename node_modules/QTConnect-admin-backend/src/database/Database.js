const knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('../../knexfile');

/**
 *
 */
class Database {
  /**
     * Constructor for the Database class
     */
  constructor() {
    this.knex = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the database
   */
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    const environment = process.env.NODE_ENV || 'development';
    this.knex = knex(knexConfig[environment]);

    // Bind Objection.js to Knex instance
    Model.knex(this.knex);

    // Test the connection
    await this.knex.raw('SELECT 1');

    this.isInitialized = true;
  }

  /**
   * Close the database connection
   */
  async close() {
    if (this.knex) {
      await this.knex.destroy();
      this.isInitialized = false;
    }
  }

  /**
   * Get the Knex instance
   */
  getKnex() {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.knex;
  }

  /**
   * Migrate the database
   */
  async migrate() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    await this.knex.migrate.latest();
  }

  /**
   * Rollback the database
   */
  async rollback() {

    if (!this.isInitialized) {
      await this.initialize();
    }
    await this.knex.migrate.rollback();
  }

  /**
   * Seed the database
   */
  async seed() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    await this.knex.seed.run();
  }
}

/**
 * Export the database instance
 */

module.exports = {
  database: new Database()
};
  
