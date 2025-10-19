# QtConnect Backend

A Node.js backend application built with Express, SQLite, and advanced cryptographic features following SOLID principles.

## Quick Start

### Prerequisites

- **Node.js** >= 24.3.0
- **npm** or **yarn** package manager
- **Git**

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the environment example file:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   HOST=localhost
   DB_CLIENT=better-sqlite3
   DB_FILENAME=./data/database.sqlite
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=1000
   LOG_LEVEL=info
   ```

4. **Database Setup**
   
   Run database migrations:
   ```bash
   npm run migrate
   ```
   
   Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   
   The server should be running on `http://localhost:3000`
   
   Test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

## Project Structure

```
backend/
├── src/
│   ├── core/              # Application core
│   │   └── Application.js # Main application class
│   ├── controllers/      # HTTP controllers
│   │   └── UserController.js
│   ├── services/         # Business logic
│   │   ├── UserService.js
│   │   └── PublicKeyService.js
│   ├── models/           # Data models
│   │   └── User.js
│   ├── repositories/     # Data access layer
│   │   └── UserRepository.js
│   ├── routes/           # API routes
│   │   ├── AppRoutes.js
│   │   ├── UserRoutes.js
│   │   ├── HealthRoutes.js
│   │   └── CryptoRoutes.js
│   ├── middleware/       # Express middleware
│   │   ├── SecurityMiddleware.js
│   │   ├── ValidationMiddleware.js
│   │   ├── ErrorHandler.js
│   │   └── BasicMiddleware.js
│   ├── database/         # Database configuration
│   │   ├── Database.js
│   │   ├── migrations/   # Database migrations
│   │   └── seeds/        # Database seeds
│   ├── utils/           # Utility functions
│   │   ├── CryptoUtils.js
│   │   ├── Logger.js
│   │   ├── KeyManager.js
│   │   └── ProtobufUtils.js
│   ├── config/          # Configuration files
│   │   ├── DatabaseConfig.js
│   │   └── ServerConfig.js
│   └── tests/           # Test files
│       ├── unit/
│       └── integration/
├── data/                # SQLite database files
├── logs/                # Application logs
├── keys/                # Cryptographic keys
├── proto/               # Protocol Buffer definitions
├── knexfile.js          # Knex.js configuration
├── package.json         # Dependencies and scripts
└── Dockerfile          # Docker configuration
```

## Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Server port | `3000` | `3000` |
| `HOST` | Server host | `localhost` | `0.0.0.0` |
| `DB_CLIENT` | Database client | `better-sqlite3` | `better-sqlite3` |
| `DB_FILENAME` | Database file path | `./data/database.sqlite` | `/app/data/db.sqlite` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `1000` |
| `LOG_LEVEL` | Logging level | `info` |


## Database Management

### Migrations

Create a new migration:
```bash
npx knex migrate:make migration_name
```

Run migrations:
```bash
npm run migrate
```

Rollback migrations:
```bash
npm run migrate:rollback
```

### Seeds

Create a new seed:
```bash
npx knex seed:make seed_name
```

Run seeds:
```bash
npm run seed
```

### Database Schema

The main `users` table structure:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  status ENUM('active', 'inactive') DEFAULT 'active',
  emailHash VARCHAR(96), -- SHA-384 hash
  signature TEXT, -- Base64-encoded digital signature
  createdAt VARCHAR NOT NULL,
  updatedAt VARCHAR NOT NULL
);
```

## Cryptographic System

### Supported Algorithms

- **ECDSA**: secp256k1 curve with SHA-384 hashing
- **RSA**: RSA-SHA384 signatures
- **Hashing**: SHA-384 for email verification
- **Serialization**: Protocol Buffers for data exchange

### Key Management

The system automatically generates cryptographic keys for:
- Digital signature creation
- Email hash verification
- Data integrity validation

Keys are stored securely and can be rotated as needed.

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Test Database**: Separate test database for isolation

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/users` | Create user |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/stats` | User statistics |
| `GET` | `/api/users/export` | Export users (Protobuf) |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |

### Request/Response Examples

**Create User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "role": "user"}'
```

**Get User Statistics:**
```bash
curl http://localhost:3000/api/users/stats
```

## Security Features

- **Rate Limiting**: 1000 requests per 15 minutes
- **CORS Protection**: Configurable origins
- **Helmet Security**: HTTP security headers
- **Input Validation**: Joi schema validation
- **Digital Signatures**: ECDSA/RSA verification
- **SQL Injection Protection**: Parameterized queries

## Monitoring & Logging

### Logging

The application uses Winston for structured logging:

- **Error Logs**: `logs/error.log`
- **General Logs**: `logs/log.log`
- **Log Levels**: error, warn, info, debug

### Health Monitoring

Health check endpoint:
```bash
curl http://localhost:3000/health
```

## Docker Support

### Build and Run

```bash
# Build Docker image
docker build -t qtconnect-backend .

# Run container
docker run -p 3000:3000 qtconnect-backend
```

### Docker Compose

The backend is included in the main `docker-compose.yml`:

```yaml
backend:
  build: ./backend
  ports: ["3000:3000"]
  environment:
    - NODE_ENV=production
    - DB_FILENAME=/usr/src/app/data/database.sqlite
  volumes:
    - backend_data:/usr/src/app/data
    - backend_logs:/usr/src/app/logs
```

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run migrate` | Run database migrations |
| `npm run migrate:rollback` | Rollback database migrations |
| `npm run seed` | Run database seeds |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure SQLite file path is correct
   - Check file permissions
   - Run migrations: `npm run migrate`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process: `lsof -ti:3000 | xargs kill -9`

3. **Missing Dependencies**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install`

4. **Migration Errors**
   - Check database file exists
   - Verify migration files are valid
   - Run `npm run migrate:rollback` then `npm run migrate`

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run linting: `npm run lint`
6. Run tests: `npm test`
7. Submit a pull request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**GANZA Jean Respice** - Full Stack Developer
