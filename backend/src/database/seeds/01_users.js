const CryptoUtils = require('../../utils/CryptoUtils');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Initialize crypto utils for generating signatures
  const cryptoUtils = new CryptoUtils();

  // Sample users data
  const users = [
    {
      email: 'admin@qtconnect.com',
      role: 'admin',
      status: 'active'
    },
    {
      email: 'john.doe@example.com',
      role: 'user',
      status: 'active'
    },
    {
      email: 'jane.smith@example.com',
      role: 'user',
      status: 'active'
    },
    {
      email: 'bob.wilson@example.com',
      role: 'user',
      status: 'inactive'
    },
    {
      email: 'alice.brown@example.com',
      role: 'user',
      status: 'active'
    },
    {
      email: 'charlie.davis@example.com',
      role: 'admin',
      status: 'active'
    },
    {
      email: 'diana.garcia@example.com',
      role: 'user',
      status: 'active'
    },
    {
      email: 'eve.jones@example.com',
      role: 'user',
      status: 'inactive'
    },
    {
      email: 'frank.miller@example.com',
      role: 'user',
      status: 'active'
    },
    {
      email: 'grace.taylor@example.com',
      role: 'user',
      status: 'active'
    }
  ];

  // Process users and generate crypto signatures
  const processedUsers = users.map(user => {
    try {
      const signatureData = cryptoUtils.signUserEmail(user.email);
      
      return {
        email: user.email,
        role: user.role,
        status: user.status,
        email_hash: signatureData.emailHash,
        digital_signature: JSON.stringify(signatureData.signatures),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
      // Fallback without crypto signature
      return {
        email: user.email,
        role: user.role,
        status: user.status,
        email_hash: null,
        digital_signature: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  });

  // Insert users into database
  await knex('users').insert(processedUsers);

  console.log(`Seeded ${processedUsers.length} users successfully`);
};
