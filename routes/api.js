const express = require('express');
const router = express.Router();
const Principal = require('../models/Principal');
const Note = require('../models/Note');


router.get('/user', (req, res) => {
    Principal.findOne({ _id: req.userId }).then(doc => {
        if(!doc) {
            res.status(403).json({ error: "User not found" });
        } else {
            const user = doc.toJSON();
            delete user.password;
            res.status(200).json({ user: user });
        }
    });
});

router.get('/users', (req, res) => {
    Principal.find({}).then(docs => {
        if (!docs) {
            res.status(403).json({ error: 'Users not found' });
        } else {
            const users = docs.map(doc => {
                const user = doc.toJSON();
                delete user.password;
                return user;
            });
            res.status(200).json({ users: users });
        }
    });
});

router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find({ 'user': req.userId }).populate('user');
        res.status(200).json({ notes });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/notes/:userId', async (req, res) => {
    try {
        const notes = await Note.find({ sharedUserIds: { $all: [req.params.userId] } }).populate('user');
        res.status(200).json({ notes });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/notes', async (req, res) => {
    let user = null;
    try {
        user = await Principal.findOne({ _id: req.userId });
    } catch (err) {
        res.status(403).json({ error: "User not found" });
    }
    if (!user) {
        return;
    }
    try {
        const note = new Note({ text: req.body.text, user: user });
        const result = await note.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete('/notes/:id', async (req, res) => {
    try {
        const result = await Note.deleteOne({ _id: req.params.id });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put('/notes/:id', async (req, res) => {
    try {
        Note.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(doc => {
            if (!doc) {
                res.status(500).json({ error: "Couldn't update note" });
            }
            res.status(200).json(doc);
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;