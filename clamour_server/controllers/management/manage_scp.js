var client = require('scp2');

client.scp('file.txt', {
    host: 'example.com',
    username: 'admin',
    password: 'password',
    path: '/home/admin/'
}, function(err) {})