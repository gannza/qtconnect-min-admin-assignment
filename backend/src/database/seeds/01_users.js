const CryptoUtils = require('../../utils/CryptoUtils');
const { logger } = require('../../utils/Logger');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Initialize crypto utils for generating signatures
  const cryptoUtils = new CryptoUtils();
  await cryptoUtils.initialize();

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

  // Generate dates for the last 7 days
  const generateDateForUser = (index) => {
    const now = new Date();
    const daysAgo = index % 7; // Spread across 7 days
    const userDate = new Date(now);
    userDate.setDate(now.getDate() - daysAgo);
    
    // Add some random hours and minutes for variety
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    userDate.setHours(randomHours, randomMinutes, 0, 0);
    
    return userDate.toISOString();
  };

  // Process users and generate crypto signatures
  const processedUsers = users.map((user, index) => {
    try {
      const signatureData = cryptoUtils.signUserEmail(user.email);
      
      // Encode the signature for storage (Base64 encoding)
      const encodedSignature = Buffer.from(JSON.stringify(signatureData.signature)).toString('base64');
      
      const createdAt = generateDateForUser(index);
      const updatedAt = createdAt; // Same as created for seed data
      
      return {
        email: user.email,
        role: user.role,
        status: user.status,
        emailHash: signatureData.emailHash,
        signature: encodedSignature,
        createdAt,
        updatedAt
      };
    } catch (error) {
      logger.error('Failed to generate crypto signature for user', error);
      // Fallback without crypto signature
      const createdAt = generateDateForUser(index);
      const updatedAt = createdAt;
      
      return {
        email: user.email,
        role: user.role,
        status: user.status,
        emailHash: null,
        signature: null,
        createdAt,
        updatedAt
      };
    }
  });

  // Insert users into database
  await knex('users').insert(processedUsers);

};
