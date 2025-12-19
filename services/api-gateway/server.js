const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Service endpoints (can be configured via environment variables)
const services = {
  aws: process.env.AWS_SERVICE_URL || 'http://aws-service:3001',
  azure: process.env.AZURE_SERVICE_URL || 'http://azure-service:3002',
  gcp: process.env.GCP_SERVICE_URL || 'http://gcp-service:3003'
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../../index.html');
});

// Serve static files
app.use(express.static(__dirname + '/../..'));

// AWS service proxy
app.use('/aws', createProxyMiddleware({
  target: services.aws,
  changeOrigin: true,
  pathRewrite: {
    '^/aws': ''
  },
  onError: (err, req, res) => {
    console.error('AWS service proxy error:', err.message);
    res.status(503).json({
      error: 'AWS service unavailable',
      message: err.message
    });
  }
}));

// Azure service proxy
app.use('/azure', createProxyMiddleware({
  target: services.azure,
  changeOrigin: true,
  pathRewrite: {
    '^/azure': ''
  },
  onError: (err, req, res) => {
    console.error('Azure service proxy error:', err.message);
    res.status(503).json({
      error: 'Azure service unavailable',
      message: err.message
    });
  }
}));

// GCP service proxy
app.use('/gcp', createProxyMiddleware({
  target: services.gcp,
  changeOrigin: true,
  pathRewrite: {
    '^/gcp': ''
  },
  onError: (err, req, res) => {
    console.error('GCP service proxy error:', err.message);
    res.status(503).json({
      error: 'GCP service unavailable',
      message: err.message
    });
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    message: 'The requested resource was not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Proxying to services:`);
  console.log(`   AWS: ${services.aws}`);
  console.log(`   Azure: ${services.azure}`);
  console.log(`   GCP: ${services.gcp}`);
});
