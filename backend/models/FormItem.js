const mongoose = require('mongoose');

const FormItemSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, 'Form Text is required']
  },
  subtext: {
    type: String,
    trim: true,
  },
  schema: {
    type: String, //text, long_text, single_select, multiple_select, date, yes_no
    required: [true, "Form Item Type is required"]
  },
  choices: [
    {
      choiceText: {
        type: String,
        trim: true,
      }
    }
  ],
  required: {
    type: Boolean,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true
  },
  
});
module.exports = mongoose.model("Form", FormSchema);