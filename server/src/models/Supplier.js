const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierType: {
    type: String,
    required: true,
    enum: ['RN', 'EN', 'PCW', 'HCA']
  },
  contactPerson: {
    nameEn: {
      type: String,
      required: true,
      trim: true
    },
    nameCn: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  gender: {
    type: String,
    required: true,
    enum: ['M', 'F']
  },
  address: {
    street: String,
    addressLine2: String,
    district: {
      type: String,
      required: true
    }
  },
  hkid: {
    type: String,
    required: true,
    trim: true
  },
  idCardFileUrl: {
    type: String,
    required: true
  },
  dateOfBirth: {
    day: {
      type: String,
      required: true
    },
    month: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    }
  },
  documents: [{
    type: {
      type: String,
      required: true,
      enum: ['Business License', 'Tax Certificate', 'Insurance', 'Other']
    },
    fileUrl: {
      type: String,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  professionalCertifications: [{
    name: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    expiryDate: {
      type: String,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  bankAccount: {
    bank: {
      type: String,
      required: true
    },
    bankCode: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    cardHolderName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
supplierSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Supplier', supplierSchema, 'application'); 