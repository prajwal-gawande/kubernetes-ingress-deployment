const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

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
        service: 'gcp-service',
        provider: 'Google Cloud Platform',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        region: process.env.GCP_REGION || 'us-central1'
    });
});

// API health endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'gcp-api',
        message: 'GCP API is running',
        timestamp: new Date().toISOString()
    });
});

// Web health endpoint
app.get('/web/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'gcp-web',
        message: 'GCP Web service is running',
        timestamp: new Date().toISOString()
    });
});

// Service info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        provider: 'GCP',
        services: {
            compute: ['GKE', 'Cloud Run', 'Compute Engine', 'Cloud Functions'],
            networking: ['VPC', 'Cloud Load Balancing', 'Cloud Armor', 'API Gateway', 'Cloud CDN'],
            data: ['BigQuery', 'Cloud SQL', 'Firestore', 'Memorystore', 'Cloud Storage'],
            security: ['IAM', 'Cloud KMS', 'Security Command Center', 'Policy Controller'],
            cicd: ['Cloud Build', 'Spinnaker', 'GitHub Actions', 'ArgoCD'],
            observability: ['Cloud Monitoring', 'Logging', 'Trace', 'Error Reporting']
        },
        features: ['Infrastructure as Code', 'CI/CD Pipelines', 'SRE Best Practices']
    });
});

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../gcp/index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        service: 'gcp-service',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        service: 'gcp-service',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 GCP Service running on port ${PORT}`);
    console.log(`☁️  Provider: Google Cloud Platform`);
});
