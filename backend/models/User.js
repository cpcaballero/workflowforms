const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First Name is required']
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required']
  },
  nameSuffix : {
    type: String,
    trim: true,
    required: false
  },
  birthDate: {
    type: Date,
    trim: true,
    required: [true, 'Birth Date is required']
  },
  type: {
    type: String,
    trim: true,
  },
  emailAddress: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email Address is required"]
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required']
  },
  gender: {
    type: String,
    trim: true,
    required: [true, "Gender is required"]
  },
  mobileNumber: {
    type: String,
    trim: true,
    required: [true, "Mobile Number is required"]
  },
});
module.exports = mongoose.model("User", UserSchema);
