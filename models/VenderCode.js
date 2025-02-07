const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenderCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    }
},{
    timestamps: true
});


module.exports = mongoose.model('VenderCode', VenderCodeSchema);