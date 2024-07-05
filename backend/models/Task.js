const mongoose = require('mongoose');
const Project = require('./Project');
const Schema = mongoose.Schema;

const TaskSchema = Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    status: { type: String, default: 'Pending' },
    dueDate: { type: Date },
});

module.exports = mongoose.model('Task', TaskSchema);