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
    type: String,
    default: "No"
  },
  formItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FormItem'
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
  dateUpdated: {
    type: Date,
    default: Date.now,
    required: true
  },
  formEntries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormEntry"
    }
  ]
});
module.exports = mongoose.model("Form", FormSchema);
