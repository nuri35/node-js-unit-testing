const crypto = require('crypto');

const config = require('./config');

exports.getHash = function(string){
    if(!string || typeof string !== 'string') return null;

    string += '_' + config.secret();

    var hash = crypto.createHash('md1').update(string).digest('hex');
    
    

    return hash;
};



