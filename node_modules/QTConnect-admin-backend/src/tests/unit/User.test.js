const User = require('../../models/User');

describe('User Model', () => {
  describe('tableName', () => {
    it('should return correct table name', () => {
      expect(User.tableName).toBe('users');
    });
  });

  describe('jsonSchema', () => {
    it('should have correct schema structure', () => {
      const schema = User.jsonSchema;
      
      expect(schema.type).toBe('object');
      expect(schema.required).toEqual(['email', 'role', 'status']);
      expect(schema.properties).toBeDefined();
    });

    it('should have correct email property', () => {
      const emailProp = User.jsonSchema.properties.email;
      
      expect(emailProp.type).toBe('string');
      expect(emailProp.format).toBe('email');
      expect(emailProp.minLength).toBe(1);
      expect(emailProp.maxLength).toBe(255);
    });

    it('should have correct role property with enum', () => {
      const roleProp = User.jsonSchema.properties.role;
      
      expect(roleProp.type).toBe('string');
      expect(roleProp.enum).toEqual(['admin', 'user']);
    });

    it('should have correct status property with enum', () => {
      const statusProp = User.jsonSchema.properties.status;
      
      expect(statusProp.type).toBe('string');
      expect(statusProp.enum).toEqual(['active', 'inactive']);
    });

    it('should have correct id property', () => {
      const idProp = User.jsonSchema.properties.id;
      
      expect(idProp.type).toBe('integer');
    });

    it('should have timestamp properties', () => {
      const schema = User.jsonSchema.properties;
      
      expect(schema.createdAt.type).toBe('string');
      expect(schema.createdAt.format).toBe('date-time');
      expect(schema.updatedAt.type).toBe('string');
      expect(schema.updatedAt.format).toBe('date-time');
    });
  });

  describe('$formatJson', () => {
    it('should preserve all fields in JSON output', () => {
      const user = new User();
      const jsonData = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        status: 'active',
        signature: 'sensitive_data',
        createdAt: '2023-01-01T00:00:00Z'
      };

      const result = user.$formatJson(jsonData);

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe('user');
      expect(result.status).toBe('active');
      expect(result.signature).toBe('sensitive_data');
      expect(result.createdAt).toBe('2023-01-01T00:00:00Z');
    });

    it('should preserve non-sensitive fields', () => {
      const user = new User();
      const jsonData = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        status: 'active',
        emailHash: 'hash_value',
        signature: 'sensitive_data',
        createdAt: '2023-01-01T00:00:00Z'
      };

      const result = user.$formatJson(jsonData);

      expect(result.emailHash).toBe('hash_value');
    });
  });

  describe('isActive', () => {
    it('should return true when status is active', () => {
      const user = new User();
      user.status = 'active';
      
      expect(user.isActive()).toBe(true);
    });

    it('should return false when status is inactive', () => {
      const user = new User();
      user.status = 'inactive';
      
      expect(user.isActive()).toBe(false);
    });

    it('should return false when status is undefined', () => {
      const user = new User();
      user.status = undefined;
      
      expect(user.isActive()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true when role is admin', () => {
      const user = new User();
      user.role = 'admin';
      
      expect(user.isAdmin()).toBe(true);
    });

    it('should return false when role is user', () => {
      const user = new User();
      user.role = 'user';
      
      expect(user.isAdmin()).toBe(false);
    });

    it('should return false when role is undefined', () => {
      const user = new User();
      user.role = undefined;
      
      expect(user.isAdmin()).toBe(false);
    });
  });

  describe('Model instantiation', () => {
    it('should create user instance with properties', () => {
      const userData = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        status: 'active'
      };

      const user = new User();
      Object.assign(user, userData);

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
      expect(user.status).toBe('active');
    });

    it('should create empty user instance', () => {
      const user = new User();

      expect(user).toBeInstanceOf(User);
    });
  });
});
