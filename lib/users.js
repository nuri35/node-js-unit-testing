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
       console.log("calsıtı")
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


exports.update = async function (id, data) {
    try {
        const user = await User.findById(id);
        user.prop = data.age
      
        const result = await user.save();
        
        return result;
    } catch (err) {
  
       
        return Promise.reject(err);
    }
}


exports.resetPassword = function (email) {
    if (!email) {
        return Promise.reject(new Error('Invalid email'));
    }

    //some operations

    return mailer.sendPasswordResetEmail(email);
}