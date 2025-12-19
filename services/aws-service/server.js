const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../..')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'aws-service',
        provider: 'Amazon Web Services',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        region: process.env.AWS_REGION || 'us-east-1'
    });
});

// API health endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'aws-api',
        message: 'AWS API is running',
        timestamp: new Date().toISOString()
    });
});

// Web health endpoint
app.get('/web/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'aws-web',
        message: 'AWS Web service is running',
        timestamp: new Date().toISOString()
    });
});

// Service info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        provider: 'AWS',
        services: {
            compute: ['ECS Fargate', 'EKS', 'Lambda', 'EC2 Auto Scaling'],
            networking: ['VPC', 'ALB/NLB', 'API Gateway', 'Route 53', 'CloudFront'],
            data: ['DynamoDB', 'RDS', 'ElastiCache', 'S3', 'OpenSearch'],
            security: ['IAM', 'KMS', 'WAF', 'Secrets Manager', 'SSO'],
            cicd: ['CodePipeline', 'CodeBuild', 'GitHub Actions', 'ArgoCD'],
            observability: ['CloudWatch', 'Prometheus', 'Grafana', 'X-Ray', 'PagerDuty']
        },
        features: ['Infrastructure as Code', 'CI/CD Pipelines', 'Observability']
    });
});

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../aws/index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        service: 'aws-service',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        service: 'aws-service',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AWS Service running on port ${PORT}`);
    console.log(`☁️  Provider: Amazon Web Services`);
});
