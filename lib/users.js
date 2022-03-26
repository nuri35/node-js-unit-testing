const mongoose = require('mongoose');
const User = require('./models/user');

// const mailer = require('./mailer');





exports.get = function (id, callback) {
    if (!id) {
        return callback(new Error('Invalid user id'));
    }

    User.findById(id, function (err, result) {
        if (err) {
            return callback(err);
        }

        return callback(null, result);
    });
}



exports.delete = function (id) {

    if (!id) {
        return Promise.reject(new Error('Invalid id'));
    }

    return User.remove({
        _id: id
    });
}