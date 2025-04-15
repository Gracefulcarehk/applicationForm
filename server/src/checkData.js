const mongoose = require('mongoose');
require('dotenv').config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const Supplier = mongoose.model('Supplier', new mongoose.Schema({}, { strict: false }), 'application');
    
    // Search for the specific email
    const supplier = await Supplier.findOne({ 'contactPerson.email': 'ricky@hellotoby.com' });
    
    if (supplier) {
      console.log('Found supplier with email ricky@hellotoby.com:');
      console.log(JSON.stringify(supplier, null, 2));
    } else {
      console.log('No supplier found with email ricky@hellotoby.com');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkData(); 