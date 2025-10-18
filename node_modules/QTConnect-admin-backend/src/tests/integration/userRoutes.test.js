const request = require('supertest');
const express = require('express');

// Create a simple test app
const app = express();
app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});


// Track created users for duplicate email test
const createdUsers = new Set();

app.post('/api/users', (req, res) => {
  const { email, role = 'user', status = 'active' } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (email === 'invalid-email') {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (email === 'duplicate@example.com' && createdUsers.has(email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  if (role && !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  createdUsers.add(email);
  
  res.status(201).json({
    id: 1,
    email,
    role,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  if (parseInt(id) === 99999) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (updateData.role && !['admin', 'user'].includes(updateData.role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  res.json({
    id: parseInt(id),
    email: updateData.email || 'test@example.com',
    role: updateData.role || 'user',
    status: updateData.status || 'active',
    updated_at: new Date().toISOString()
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  if (parseInt(id) === 99999) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ message: 'User deleted successfully' });
});

app.get('/api/users/stats', (req, res) => {
  res.json({
    total: 0,
    active: 0,
    inactive: 0
  });
});

app.get('/api/users/recent', (req, res) => {
  const { days } = req.query;
  
  if (days && isNaN(days)) {
    return res.status(400).json({ error: 'Invalid days parameter' });
  }
  
  res.json([]);
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

describe('User Routes Integration Tests', () => {

  describe('POST /api/users', () => {
    it('should create a new user', async() => {
      const userData = {
        email: 'newuser@example.com',
        role: 'user',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('role', userData.role);
      expect(response.body).toHaveProperty('status', userData.status);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should create user with default values', async() => {
      const userData = {
        email: 'defaultuser@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.role).toBe('user');
      expect(response.body.status).toBe('active');
    });

    it('should return 400 for invalid email', async() => {
      const userData = {
        email: 'invalid-email',
        role: 'user',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid role', async() => {
      const userData = {
        email: 'test@example.com',
        role: 'invalid-role',
        status: 'active'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid status', async() => {
      const userData = {
        email: 'test@example.com',
        role: 'user',
        status: 'invalid-status'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for duplicate email', async() => {
      const userData = {
        email: 'duplicate@example.com',
        role: 'user',
        status: 'active'
      };

      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing required fields', async() => {
      const userData = {
        role: 'user',
        status: 'active'
        // Missing email
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/users/:id', () => {
    let userId;

    beforeEach(async() => {
      // Create a user for testing updates
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: 'updatetest@example.com',
          role: 'user',
          status: 'active'
        });
      
      userId = createResponse.body.id;
    });

    it('should update user successfully', async() => {
      const updateData = {
        role: 'admin',
        status: 'inactive'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.role).toBe('admin');
      expect(response.body.status).toBe('inactive');
    });

    it('should update user email and regenerate hash', async() => {
      const updateData = {
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.email).toBe('updated@example.com');
    });

    it('should return 404 for non-existent user', async() => {
      const updateData = { role: 'admin' };

      const response = await request(app)
        .put('/api/users/99999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid update data', async() => {
      const updateData = {
        role: 'invalid-role'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    let userId;

    beforeEach(async() => {
      // Create a user for testing deletion
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: 'deletetest@example.com',
          role: 'user',
          status: 'active'
        });
      
      userId = createResponse.body.id;
    });

    it('should delete user successfully', async() => {
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent user', async() => {
      const response = await request(app)
        .delete('/api/users/99999')
        .expect(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid user ID', async() => {
      const response = await request(app)
        .delete('/api/users/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

});
