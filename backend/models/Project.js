const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    trim: true,
    required: [true, 'Project Name is required']
  },
  stages: [
    {
      stageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stage'
      }
    }
  ],
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
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
module.exports = mongoose.model("Project", ProjectSchema);