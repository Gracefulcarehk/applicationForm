# Graceful Care Application Form

A modern, responsive web application for supplier registration and management, built with React, TypeScript, and Material-UI.

## Features

- **Responsive Design**: Optimized for all devices with dynamic height adjustments
- **Form Validation**: Comprehensive validation using Formik and Yup
- **File Upload**: Support for multiple file types (images and PDFs)
- **Multi-language Support**: Bilingual interface (English and Chinese)
- **Dynamic Form Fields**: Support for adding/removing professional certifications
- **Real-time Validation**: Immediate feedback on form inputs
- **Secure File Handling**: File type and size validation
- **Modern UI**: Clean, accessible interface with Material-UI components

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Material-UI
  - Formik & Yup
  - date-fns
  - React Router
  - Axios

- **Backend**:
  - Node.js
  - Express
  - Cloudflare Workers
  - Multer (for file uploads)
  - Winston (for logging)

## Prerequisites

- Node.js (v18.17.1 or higher)
- npm (v9.6.7 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Gracefulcarehk/applicationForm.git
cd applicationForm
```

2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Create environment files:
```bash
# Client
cp client/.env.example client/.env

# Server
cp server/.env.example server/.env
```

4. Update environment variables in both `.env` files with your configuration.

## Development

1. Start the development server:
```bash
# Start client
cd client
npm run dev

# Start server
cd ../server
npm run dev
```

2. The application will be available at `http://localhost:3000`

## Building for Production

1. Build the application:
```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build
```

2. Start the production server:
```bash
cd server
npm start
```

## Project Structure

```
applicationForm/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend server
│   ├── src/              # Source files
│   │   ├── api/          # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── package.json      # Backend dependencies
│
└── README.md             # Project documentation
```

## Form Fields

The application form includes the following sections:

1. **Personal Information**
   - Name (English & Chinese)
   - Email
   - Phone
   - Gender
   - Date of Birth
   - HKID
   - ID Card Upload

2. **Address Information**
   - Street Address
   - Address Line 2
   - District

3. **Bank Information**
   - Bank Name
   - Bank Code
   - Account Number
   - Card Holder Name
   - Bank Statement Upload

4. **Professional Certifications**
   - Certification Name
   - Expiry Date
   - Certification Document Upload

## File Upload Requirements

- **Supported File Types**:
  - Images: JPG, JPEG, PNG
  - Documents: PDF

- **File Size Limits**:
  - Maximum size: 5MB per file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team at [support@gracefulcare.hk](mailto:support@gracefulcare.hk)

## Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:5003
VITE_UPLOAD_URL=http://localhost:5003/upload
```

### Server (.env)
```
PORT=5003
NODE_ENV=development
LOG_LEVEL=info
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

## API Documentation

### Endpoints

- **POST /api/suppliers**
  - Create a new supplier application
  - Accepts multipart/form-data with form fields and files

- **GET /api/suppliers**
  - List all supplier applications
  - Returns JSON array of suppliers

- **GET /api/suppliers/:id**
  - Get a specific supplier application
  - Returns JSON object of supplier details

- **POST /api/upload**
  - Upload files (ID card, bank statement, certifications)
  - Returns file URL on success

## Browser Support

The application is tested and supported on the following browsers:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Testing

1. Run unit tests:
```bash
# Client tests
cd client
npm test

# Server tests
cd ../server
npm test
```

2. Run linting:
```bash
# Client linting
cd client
npm run lint

# Server linting
cd ../server
npm run lint
```

## Deployment

### Cloudflare Workers Deployment

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the worker:
```bash
cd server
wrangler deploy
```

### Database Setup

The application uses Cloudflare Workers KV for data storage. To set up:

1. Create a KV namespace:
```bash
wrangler kv:namespace create "SUPPLIER_DATA"
```

2. Add the namespace binding to `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "SUPPLIER_DATA"
id = "<namespace-id>"
```

## Security Considerations

### File Upload Security
- All uploaded files are validated for type and size
- Files are stored with unique, random names
- File paths are not exposed in URLs
- Regular security audits of uploaded files

### Data Protection
- All sensitive data is encrypted at rest
- HTTPS is enforced for all communications
- Regular security updates and patches
- Access logs are maintained for audit purposes

### API Security
- Rate limiting implemented
- CORS properly configured
- Input validation on all endpoints
- Regular security testing

## Monitoring and Logging

### Application Monitoring
- Error tracking with Winston
- Performance monitoring
- Uptime monitoring
- Resource usage tracking

### Logging Levels
- ERROR: System errors and critical issues
- WARN: Potential problems
- INFO: General operational information
- DEBUG: Detailed debugging information

## Backup Procedures

1. **Data Backup**
   - Daily automated backups of KV store
   - Weekly full system backups
   - Backup retention: 30 days

2. **File Storage Backup**
   - Real-time replication of uploaded files
   - Daily integrity checks
   - Offsite backup storage

## Error Handling

The application implements comprehensive error handling:

1. **Frontend Error Boundaries**
   - Global error boundary for the application
   - Component-level error boundaries
   - Graceful degradation for failed features

2. **API Error Handling**
   - Standardized error responses
   - Retry mechanisms for transient failures
   - Circuit breakers for external services

## Performance Optimization

1. **Frontend**
   - Code splitting
   - Lazy loading of components
   - Image optimization
   - Caching strategies

2. **Backend**
   - Response caching
   - Query optimization
   - Connection pooling
   - Load balancing

## Maintenance

### Regular Tasks
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews
- Annual architecture review

### Update Procedures
1. Create backup
2. Deploy to staging
3. Run test suite
4. Deploy to production
5. Verify functionality
6. Monitor for issues