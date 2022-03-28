const mongoose = require('mongoose');
const User = require('./models/user');

const mailer = require('./mailer');





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




exports.create = function (data) {
    if (!data || !data.email || !data.name) {
        return Promise.reject(new Error('Invalid arguments'));
    }

    let user = new User(data);

 
    return user.save().then((result) => {
        return mailer.sendWelcomeEmail(data.email, data.name).then(() => {
            return {
                message: 'User created',
                userId: result.id
            };
        });
    }).catch((err) => {
        return Promise.reject(err);
    });
}
