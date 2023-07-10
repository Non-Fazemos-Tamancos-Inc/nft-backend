const express = require('express');
const sessionRouter = express.Router();

const User = require('../../database/schemas/user');
const Session = require('../../database/schemas/session');

sessionRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!await user.validatePassword(password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const session = new Session({
            username,
        });
        const session_id = await session.set_id(password);
        await session.save();

        res.json({ session_id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

sessionRouter.get('/', async (req, res) => {
    try {
        const { session_id } = req.headers;

        if (!session_id) {
            return res.status(401).json({ message: 'SessionId is required' });
        }

        let session = await Session.findOne({session_id});

        if (session) {
            res.json(session);
        } else {
            return res.status(401).json({ message: 'Invalid sessionId' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


const deleteAllSessions = async () => {
    try {
        console.log('Clearing all sessions...');
        await Session.deleteMany({});
    } catch (err) {
        console.error('Error deleting sessions:', err);
    }
};

process.on('SIGINT', async () => {
    await deleteAllSessions();
    process.exit(0);
});

module.exports = sessionRouter;
