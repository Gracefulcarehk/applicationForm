export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://www.wemixtech.com/api',
    endpoints: {
      suppliers: '/suppliers',
      uploads: '/uploads',
      cleanup: '/cleanup',
    },
    timeout: {
      default: 30000, // 30 seconds
      upload: 120000, // 2 minutes for file uploads
    },
  },
  file: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  messages: {
    success: {
      supplierCreated: 'Supplier application submitted successfully!',
      fileUploaded: 'File uploaded successfully',
    },
    errors: {
      timeout: 'Request timed out. Please try again.',
      fileTooLarge: 'File size too large. Please reduce the file size and try again.',
      uploadFailed: 'Failed to upload file. Please try again.',
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
      validationError: 'Please check your input and try again.',
      cleanupFailed: 'Failed to clean up temporary files.',
    },
  },
}; 