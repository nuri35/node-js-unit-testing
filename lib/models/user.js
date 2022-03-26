var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    age: Number
}, {
    collection: 'users'
}); 

module.exports = mongoose.model('User', UserSchema);