const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

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
        service: 'azure-service',
        provider: 'Microsoft Azure',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        region: process.env.AZURE_REGION || 'eastus'
    });
});

// API health endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'azure-api',
        message: 'Azure API is running',
        timestamp: new Date().toISOString()
    });
});

// Web health endpoint
app.get('/web/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'azure-web',
        message: 'Azure Web service is running',
        timestamp: new Date().toISOString()
    });
});

// Service info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        provider: 'Azure',
        services: {
            compute: ['AKS', 'App Service', 'Functions', 'VM Scale Sets'],
            networking: ['VNets', 'App Gateway', 'API Management', 'Front Door', 'Traffic Manager'],
            data: ['Cosmos DB', 'Azure SQL', 'Redis Cache', 'Blob Storage', 'Synapse'],
            security: ['Entra ID (AAD)', 'Key Vault', 'Defender for Cloud', 'RBAC', 'Policy'],
            cicd: ['Azure DevOps Pipelines', 'GitHub Actions', 'ArgoCD'],
            observability: ['Azure Monitor', 'Log Analytics', 'Grafana', 'App Insights']
        },
        features: ['Infrastructure as Code', 'CI/CD Pipelines', 'Observability']
    });
});

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../azure/index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        service: 'azure-service',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        service: 'azure-service',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Azure Service running on port ${PORT}`);
    console.log(`☁️  Provider: Microsoft Azure`);
});
