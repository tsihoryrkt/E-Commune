const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type:String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date  },
    endDate: { type: Date }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
