const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  formTitle: {
    type: String,
    trim: true,
    default: "Untitled Form",
    required: [true, 'Form Title is required']
  },
  formSubtitle: {
    type: String,
    trim: true
  },
  isPublished : {
    type: Boolean,
    default: false
  },

  formItems: [
    {
      formItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormItem'
      }
    }
  ],
  
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