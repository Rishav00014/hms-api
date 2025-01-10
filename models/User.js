const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: [true, 'Username already exists'],
    trim: true
  },
  profileImage:{
    type: String
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String
  },
  phoneNo: {
    type: String,
    unique: [true, 'Phone number already exists'],
  },
  designation: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  otp: {
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ['Super Admin','Supervisor'],
      message: 'Role must be either Super Admin or Supervisor'
    },
    required: true
  },
  block: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;