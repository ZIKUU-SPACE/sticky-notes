const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PrincipalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date
    },
    loginCount: {
        type: Number,
        default: 0
    },
    roles: {
        type: Array,
        default: ['guest']
    }
});

PrincipalSchema.plugin(timestamp);
const Principal = mongoose.model('Principal', PrincipalSchema);
module.exports = Principal;