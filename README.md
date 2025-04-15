# GracefulCare - Caregiver Application Portal

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0.0-blue.svg)](https://www.typescriptlang.org/)

A modern web application for managing caregiver applications with comprehensive form handling, file upload capabilities, and bilingual support (Chinese/English).

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [Features in Detail](#features-in-detail)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- Caregiver information input with validation
- Bilingual support (Chinese/English)
- File upload functionality for documents
- Interactive FAQ section
- Responsive design
- Real-time form validation
- Secure data handling
- MongoDB database integration
- RESTful API endpoints

## Tech Stack
- Frontend: 
  - React with TypeScript
  - Material-UI (MUI) for UI components
  - Formik for form handling
  - Yup for validation
  - Axios for API calls

- Backend:
  - Node.js with Express
  - MongoDB for database
  - Mongoose for ODM
  - Express-validator for input validation
  - Multer for file uploads

## Project Structure
```
AI_Web/
├── client/                 # Frontend (React + TypeScript)
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── FAQSection.tsx
│   │   │   └── SupplierForm.tsx
│   │   ├── pages/        # Page components
│   │   │   └── SupplierApplication.tsx
│   │   ├── services/     # API services
│   │   │   └── api.ts
│   │   ├── types/        # TypeScript type definitions
│   │   │   └── supplier.ts
│   │   └── App.tsx       # Main application component
│   └── package.json
│
└── server/                # Backend (Node.js + Express)
    ├── src/
    │   ├── models/       # Database models
    │   │   └── supplier.js
    │   ├── routes/       # API routes
    │   │   └── supplierRoutes.js
    │   └── index.js      # Server entry point
    └── package.json
```

## API Endpoints
- POST /suppliers - Create new caregiver application
- GET /suppliers - Get all caregiver applications
- GET /suppliers/:id - Get single caregiver application
- PUT /suppliers/:id - Update caregiver application
- DELETE /suppliers/:id - Delete caregiver application

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/gracefulcare.git
   cd gracefulcare
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Server .env example:
     ```
     PORT=5003
     MONGODB_URI=mongodb://localhost:27017/gracefulcare
     ```
   - Client .env example:
     ```
     REACT_APP_API_URL=http://localhost:5003
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend development server
   cd client
   npm start
   ```

## Development
- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:5003
- MongoDB runs on: mongodb://localhost:27017

## Features in Detail

### Form Features
- Comprehensive validation
- File upload support
- Bilingual field labels
- Real-time error messages
- Bank selection with automatic code population
- District selection with bilingual options

### FAQ Section
- Interactive accordion design
- Bilingual questions and answers
- Responsive layout
- Clean and modern styling

### File Upload
- Support for multiple file types
- Size validation
- Type validation
- Secure storage

## Troubleshooting

### Common Issues
1. Port already in use (EADDRINUSE)
   - Solution: Change PORT in .env or kill the process using the port
   - Command: `lsof -i :5003` then `kill -9 <PID>`

2. MongoDB connection issues
   - Ensure MongoDB is running
   - Check connection string in .env

3. ESLint warnings
   - Run `npm run lint` to check for issues
   - Fix or disable specific warnings as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Guidelines
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

### Code Style
- Follow the existing code style
- Run `npm run lint` before committing
- Ensure all tests pass

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.