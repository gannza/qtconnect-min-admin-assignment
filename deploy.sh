#!/bin/bash

# QTConnect Docker Deployment Script
# This script handles the deployment of both backend and frontend services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Function to create environment file
create_env_file() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from docker.env template..."
        cp docker.env .env
        print_warning "Please update the .env file with your production values!"
        print_warning "Especially change the JWT_SECRET to a secure random value."
    else
        print_status ".env file already exists"
    fi
}

# Function to build and start services
deploy_services() {
    local mode=${1:-production}
    
    print_status "Deploying in $mode mode..."
    
    if [ "$mode" = "development" ]; then
        print_status "Starting development environment..."
        docker-compose up --build -d
    else
        print_status "Starting production environment..."
        docker-compose -f docker-compose.yml up --build -d
    fi
    
    print_success "Services started successfully!"
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose exec backend npm run migrate
    print_success "Database migrations completed"
}

# Function to seed database
seed_database() {
    print_status "Seeding database..."
    docker-compose exec backend npm run seed
    print_success "Database seeded successfully"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    print_status "Service Logs (last 10 lines):"
    echo "=== Backend Logs ==="
    docker-compose logs --tail=10 backend
    echo ""
    echo "=== Frontend Logs ==="
    docker-compose logs --tail=10 frontend
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "QTConnect Docker Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy [mode]     Deploy services (production|development)"
    echo "  start            Start existing services"
    echo "  stop             Stop services"
    echo "  restart          Restart services"
    echo "  status           Show service status and logs"
    echo "  migrate          Run database migrations"
    echo "  seed             Seed the database"
    echo "  logs [service]   Show logs for a specific service"
    echo "  clean            Clean up Docker resources"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production    # Deploy in production mode"
    echo "  $0 deploy development # Deploy in development mode"
    echo "  $0 logs backend        # Show backend logs"
    echo "  $0 status              # Show service status"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_docker
        check_docker_compose
        create_env_file
        deploy_services "${2:-production}"
        print_status "Waiting for services to be ready..."
        sleep 10
        show_status
        print_success "Deployment completed!"
        print_status "Frontend: http://localhost"
        print_status "Backend API: http://localhost:3000"
        print_status "Health Check: http://localhost:3000/api/health"
        ;;
    "start")
        docker-compose up -d
        print_success "Services started"
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        docker-compose up -d
        print_success "Services restarted"
        ;;
    "status")
        show_status
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        seed_database
        ;;
    "logs")
        if [ -n "$2" ]; then
            docker-compose logs -f "$2"
        else
            docker-compose logs -f
        fi
        ;;
    "clean")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
