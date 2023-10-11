const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');

const NoteSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Principal'
    },
    tags: {
        type: Array,
        default: []
    },
    sharedUserIds: {
        type: Array,
        default: []
    }
});

NoteSchema.plugin(timestamp);
const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;