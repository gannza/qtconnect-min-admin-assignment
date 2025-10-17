const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'role', 'status'],
      properties: {
        id: { type: 'integer' },
        email: { 
          type: 'string',
          format: 'email',
          minLength: 1,
          maxLength: 255
        },
        role: { 
          type: 'string',
          enum: ['admin', 'user']
        },
        status: { 
          type: 'string',
          enum: ['active', 'inactive']
        },
        email_hash: { type: 'string' },
        digital_signature: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  // Transform data when fetching
  $formatJson(json) {
    const formatted = super.$formatJson(json);
    
    // Remove sensitive fields from JSON output
    delete formatted.digital_signature;
    
    return formatted;
  }

  // Instance methods
  isActive() {
    //Check if the user is active
    return this.status === 'active';
  }

  isAdmin() {
    //Check if the user is an admin
    return this.role === 'admin';
  }

}

module.exports = User;