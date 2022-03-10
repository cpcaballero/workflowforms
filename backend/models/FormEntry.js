const mongoose = require('mongoose');

const FormEntrySchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  },
  answers : [
    {
      formItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormItem'
      },
      answer: {
        type: mongoose.Schema.Types.Mixed,
        trim: true,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
        required: true
      }
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
    required: true
  }

});
module.exports = mongoose.model("FormEntry", FormEntrySchema);
