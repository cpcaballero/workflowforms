const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema({
  stageName: {
    type: String,
    trim: true,
    required: [true, 'Stage Name is required']
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
});
module.exports = mongoose.model("Stage", StageSchema);