# Multi-Cloud Microservices Architecture

## Overview

This application has been refactored from a monolithic architecture to a **microservices architecture** with separate services for each cloud provider (AWS, Azure, GCP) and a central API Gateway for routing.

## Architecture

```
┌─────────────────┐
│   API Gateway   │  Port 3000 - Routes requests to services
│   (Express.js)  │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
┌───▼───┐ ┌──▼────┐ ┌───▼────┐ ┌───▼────┐
│  AWS  │ │ Azure │ │  GCP   │ │ Static │
│Service│ │Service│ │Service │ │ Files  │
│ 3001  │ │ 3002  │ │ 3003   │ │        │
└───────┘ └───────┘ └────────┘ └────────┘
```

## Services

### 1. API Gateway (`services/api-gateway/`)
- **Port**: 3000
- **Purpose**: Central entry point that routes requests to appropriate microservices
- **Routes**:
  - `/` → Main landing page
  - `/aws/*` → AWS service
  - `/azure/*` → Azure service
  - `/gcp/*` → GCP service
  - `/health` → Gateway health check

### 2. AWS Service (`services/aws-service/`)
- **Port**: 3001
- **Purpose**: Serves AWS-specific content and APIs
- **Endpoints**:
  - `/` → AWS landing page
  - `/health` → Service health check
  - `/api/health` → API health endpoint
  - `/web/health` → Web health endpoint
  - `/api/info` → AWS service information

### 3. Azure Service (`services/azure-service/`)
- **Port**: 3002
- **Purpose**: Serves Azure-specific content and APIs
- **Endpoints**:
  - `/` → Azure landing page
  - `/health` → Service health check
  - `/api/health` → API health endpoint
  - `/web/health` → Web health endpoint
  - `/api/info` → Azure service information

### 4. GCP Service (`services/gcp-service/`)
- **Port**: 3003
- **Purpose**: Serves GCP-specific content and APIs
- **Endpoints**:
  - `/` → GCP landing page
  - `/health` → Service health check
  - `/api/health` → API health endpoint
  - `/web/health` → Web health endpoint
  - `/api/info` → GCP service information

## Benefits of Microservices Architecture

### 1. **Scalability**
- Each service can be scaled independently based on demand
- AWS service experiencing high traffic? Scale only that service

### 2. **Maintainability**
- Clear separation of concerns
- Each service has its own codebase and dependencies
- Easier to understand and modify individual services

### 3. **Independent Deployment**
- Deploy services independently without affecting others
- Faster deployment cycles
- Reduced risk of system-wide failures

### 4. **Technology Flexibility**
- Each service can use different technologies if needed
- Easy to upgrade or change tech stack for individual services

### 5. **Fault Isolation**
- Failure in one service doesn't bring down the entire system
- Better resilience and availability

### 6. **Team Autonomy**
- Different teams can own different services
- Parallel development without conflicts

## Local Development

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed

### Option 1: Using Docker Compose (Recommended)

1. **Start all services**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Main page: http://localhost:3000
   - AWS service: http://localhost:3000/aws/
   - Azure service: http://localhost:3000/azure/
   - GCP service: http://localhost:3000/gcp/

3. **Check service health**:
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   curl http://localhost:3003/health
   ```

4. **Stop services**:
   ```bash
   docker-compose down
   ```

### Option 2: Running Services Individually

1. **Install dependencies for each service**:
   ```bash
   cd services/api-gateway && npm install
   cd ../aws-service && npm install
   cd ../azure-service && npm install
   cd ../gcp-service && npm install
   ```

2. **Start each service in separate terminals**:
   ```bash
   # Terminal 1 - AWS Service
   cd services/aws-service
   npm start

   # Terminal 2 - Azure Service
   cd services/azure-service
   npm start

   # Terminal 3 - GCP Service
   cd services/gcp-service
   npm start

   # Terminal 4 - API Gateway
   cd services/api-gateway
   npm start
   ```

3. **Access**: http://localhost:3000

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (EKS, AKS, GKE, or local like Minikube)
- kubectl configured
- Docker images built and pushed to a registry

### Build and Push Images

```bash
# Build images
docker build -t your-registry/api-gateway:latest ./services/api-gateway
docker build -t your-registry/aws-service:latest ./services/aws-service
docker build -t your-registry/azure-service:latest ./services/azure-service
docker build -t your-registry/gcp-service:latest ./services/gcp-service

# Push images
docker push your-registry/api-gateway:latest
docker push your-registry/aws-service:latest
docker push your-registry/azure-service:latest
docker push your-registry/gcp-service:latest
```

### Deploy to Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s-files/microservices/

# Check deployments
kubectl get deployments
kubectl get services
kubectl get ingress

# Check pod status
kubectl get pods
```

### Access the Application

```bash
# Get ingress IP/hostname
kubectl get ingress

# Access via ingress
curl http://<ingress-host>/
curl http://<ingress-host>/aws/
curl http://<ingress-host>/azure/
curl http://<ingress-host>/gcp/
```

## API Documentation

### Health Check Endpoints

All services expose a `/health` endpoint:

**Response Format**:
```json
{
  "status": "healthy",
  "service": "service-name",
  "provider": "Cloud Provider Name",
  "timestamp": "2025-12-19T17:30:00.000Z",
  "uptime": 123.456,
  "region": "us-east-1"
}
```

### Service Info Endpoints

Each cloud service exposes an `/api/info` endpoint with service details:

**AWS Example**:
```bash
curl http://localhost:3001/api/info
```

**Response**:
```json
{
  "provider": "AWS",
  "services": {
    "compute": ["ECS Fargate", "EKS", "Lambda", "EC2 Auto Scaling"],
    "networking": ["VPC", "ALB/NLB", "API Gateway", "Route 53", "CloudFront"],
    "data": ["DynamoDB", "RDS", "ElastiCache", "S3", "OpenSearch"],
    "security": ["IAM", "KMS", "WAF", "Secrets Manager", "SSO"],
    "cicd": ["CodePipeline", "CodeBuild", "GitHub Actions", "ArgoCD"],
    "observability": ["CloudWatch", "Prometheus", "Grafana", "X-Ray", "PagerDuty"]
  },
  "features": ["Infrastructure as Code", "CI/CD Pipelines", "Observability"]
}
```

## Monitoring and Observability

### Logs

View logs for each service:

```bash
# Docker Compose
docker-compose logs -f api-gateway
docker-compose logs -f aws-service
docker-compose logs -f azure-service
docker-compose logs -f gcp-service

# Kubernetes
kubectl logs -f deployment/api-gateway
kubectl logs -f deployment/aws-service
kubectl logs -f deployment/azure-service
kubectl logs -f deployment/gcp-service
```

### Metrics

Each service logs HTTP requests using Morgan middleware. In production, integrate with:
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **CloudWatch/Azure Monitor/Cloud Monitoring** for cloud-native observability

## Troubleshooting

### Service won't start
1. Check if port is already in use
2. Verify environment variables are set correctly
3. Check Docker/Node.js logs for errors

### Can't access service through API Gateway
1. Verify all services are running
2. Check network connectivity between containers
3. Verify proxy configuration in API Gateway

### Health check failing
1. Check service logs for errors
2. Verify service is listening on correct port
3. Test direct access to service (bypass gateway)

## Future Enhancements

1. **Service Discovery**: Implement Consul or Eureka for dynamic service discovery
2. **Circuit Breaker**: Add Hystrix or similar for fault tolerance
3. **API Rate Limiting**: Implement rate limiting at gateway level
4. **Authentication**: Add JWT-based authentication
5. **Caching**: Implement Redis for caching frequently accessed data
6. **Message Queue**: Add RabbitMQ or Kafka for async communication
7. **Distributed Tracing**: Implement Jaeger or Zipkin
8. **API Documentation**: Add Swagger/OpenAPI documentation

## Contributing

When adding new features:
1. Follow the existing service structure
2. Add health check endpoints
3. Update Docker Compose and Kubernetes manifests
4. Document API endpoints
5. Add appropriate error handling

## License

MIT
