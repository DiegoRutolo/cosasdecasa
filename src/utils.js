const fs = require('fs');

exports.getSecret = function(fileName) {
    return fs.readFileSync("/run/secrets/" + fileName, 'utf8');
};

exports.getConnString = function() {
    return "mongodb://mongo:27017/cosasdecasa";
};