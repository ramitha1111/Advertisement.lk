const mongoose = require('mongoose');

const compareListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement' }]
});

const CompareList = mongoose.model('CompareList', compareListSchema);

module.exports = CompareList;
