# QTConnect Docker Deployment

This document provides instructions for deploying the QTConnect admin panel using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd qtconnect-assignments
   ```

2. **Deploy the application**:
   ```bash
    ./deploy.sh deploy production
   ```

3. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/api/health

## Deployment Modes

### Production Mode
```bash
./deploy.sh deploy production
```
- Optimized builds
- Nginx reverse proxy
- Production environment variables
- Health checks enabled

### Development Mode
```bash
./deploy.sh deploy development
```
- Hot reload enabled
- Debug logging
- Volume mounts for live code changes
- Development environment variables

## Service Management

### Start Services
```bash
./deploy.sh start
```

### Stop Services
```bash
./deploy.sh stop
```

### Restart Services
```bash
./deploy.sh restart
```

### Check Status
```bash
./deploy.sh status
```

### View Logs
```bash
# All services
./deploy.sh logs

# Specific service
./deploy.sh logs backend
./deploy.sh logs frontend
```

## Database Operations

### Run Migrations
```bash
./deploy.sh migrate
```

### Seed Database
```bash
./deploy.sh seed
```

## Environment Configuration

1. **Copy environment template**:
   ```bash
   cp docker.env .env
   ```

2. **Update configuration**:
   Edit `.env` file with your production values:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0
   ```

## Architecture

### Services

1. **Backend** (`backend:3000`)
   - Node.js API server
   - SQLite database
   - Health checks
   - Logging and monitoring

2. **Frontend** (`frontend:80`)
   - React application
   - Nginx web server
   - Static asset optimization
   - Client-side routing

3. **Nginx** (`nginx:80`) - Optional
   - Reverse proxy
   - Load balancing
   - SSL termination
   - Rate limiting

### Volumes

- `backend_data`: Database storage
- `backend_logs`: Application logs

### Networks

- `qtconnect-network`: Internal communication between services

## Production Deployment

### Using Nginx Reverse Proxy

1. **Deploy with nginx**:
   ```bash
   docker-compose --profile production up -d
   ```

2. **Access through nginx**:
   - Application: http://localhost:8080
   - API: http://localhost:8080/api

### SSL Configuration

To enable SSL, update the nginx configuration:

1. **Add SSL certificates** to `nginx/ssl/`
2. **Update nginx.conf** with SSL configuration
3. **Restart nginx** service

## Monitoring and Health Checks

### Health Check Endpoints

- Backend: `http://localhost:3000/api/health`
- Frontend: `http://localhost/health`
- Nginx: `http://localhost:8080/health`

### Logs

View logs for troubleshooting:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   - Check if ports 80, 3000, or 8080 are in use
   - Update port mappings in docker-compose.yml

2. **Database issues**:
   - Ensure database volume is properly mounted
   - Run migrations: `./deploy.sh migrate`

3. **Build failures**:
   - Check Docker daemon is running
   - Clear Docker cache: `docker system prune -a`

4. **Permission issues**:
   - Ensure deploy.sh is executable: `chmod +x deploy.sh`
   - Check file permissions for volumes

### Debugging

1. **Check service status**:
   ```bash
   ./deploy.sh status
   ```

2. **View detailed logs**:
   ```bash
   ./deploy.sh logs backend
   ```

3. **Access container shell**:
   ```bash
   docker-compose exec backend sh
   docker-compose exec frontend sh
   ```

## Cleanup

### Remove all containers and volumes
```bash
./deploy.sh clean
```

### Remove specific service
```bash
docker-compose stop backend
docker-compose rm backend
```

## Security Considerations

1. **Change default secrets**:
   - Update JWT_SECRET in .env
   - Use strong passwords
   - Enable HTTPS in production

2. **Network security**:
   - Use internal networks
   - Limit exposed ports
   - Configure firewalls

3. **Container security**:
   - Use non-root users
   - Keep images updated
   - Scan for vulnerabilities

## Performance Optimization

1. **Resource limits**:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: '0.5'
   ```

2. **Caching**:
   - Enable nginx caching
   - Use Redis for session storage
   - Implement CDN for static assets

3. **Database optimization**:
   - Use connection pooling
   - Optimize queries
   - Regular backups

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec backend sqlite3 /app/data/database.sqlite ".backup /app/data/backup.sqlite"

# Restore backup
docker-compose exec backend sqlite3 /app/data/database.sqlite ".restore /app/data/backup.sqlite"
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v qtconnect-assignments_backend_data:/data -v $(pwd):/backup alpine tar czf /backup/backend_data.tar.gz -C /data .
```

## Support

For issues and questions:
1. Check the logs: `./deploy.sh logs`
2. Verify service status: `./deploy.sh status`
3. Review this documentation
4. Check Docker and Docker Compose documentation
