require('dotenv-safe').config({
    path: `${__dirname}/.env`,
    example: `${__dirname}/.env.example`,
});
const checkVersion = require('../build/check-versions');

checkVersion(); // 检查node.js和npm版本


const mongoose = require('mongoose');

const app = require('./app');
const config = require('../config/server');

const Socket = require('./models/socket');
const Group = require('./models/group');
const getRandomAvatar = require('../utils/getRandomAvatar');

global.mdb = new Map(); // Use as in-memory database
global.mdb.set('sealList', new Set()); // Blocked user list
global.mdb.set('newUserList', new Set()); // New registered user list

mongoose.Promise = Promise;

mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true }, async (err) => {
    if (err) {
        console.error('connect database error!');
        console.error(err);
        return process.exit(1);
    }

    // Determine if the default group exists, create a one if it does not exist
    const group = await Group.findOne({ isDefault: true });
    if (!group) {
        const defaultGroup = await Group.create({
            name: config.defaultGroupName,
            avatar: getRandomAvatar(),
            isDefault: true,
        });
        if (!defaultGroup) {
            console.error('create default group fail');
            return process.exit(1);
        }
    } else if (group.name !== config.defaultGroupName) {
        group.name = config.defaultGroupName;
        await group.save();
    }

    app.listen(config.port, async () => {
        await Socket.deleteMany({}); // Delete all historical data of the Socket table
        console.log(` >>> server listen on http://localhost:${config.port}`);
    });
});
