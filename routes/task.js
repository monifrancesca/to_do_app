var express = require('express');
var router = express.Router();
var path = require('path');
var newTask = [];
var bodyParser = require('body-parser');

router.get('/', function(req, res) {
    res.send(newTask);
});

router.post('/', function(req, res) {
    console.log('before push', req.body);
    newTask.push(req.body);
    console.log('back end', newTask);
    res.send(newTask);
});

module.exports = router;
module.exports.newTask = newTask;
