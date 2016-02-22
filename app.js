var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var task = require('./routes/task');

// bring in pg module
var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/todo_list';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// get task route
app.get('/task', function(req, res) {
    console.log('In the task route');
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM tasks ORDER BY id DESC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            //done();
            client.end(); // shuts down all connections
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});


// set up database and task route
app.post('/task', function(req, res) {
    console.log('I\'m posting to the task route');
    var addTask = {
        task_name: req.body.taskName
        //task_completed: req.body.taskCompleted
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO tasks (task_name) VALUES ($1) RETURNING id",
            [addTask.task_name],
            function (err, result) {
                done(); // call done and close connection so that you will still see responses on the dom. pg has a 10 connection max. need this anytime you do a pg connection. if you restart the server you won't see this happen, so you need to close it here.
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

    console.log(addTask);

});


//app.use('/task', task);

app.get('/*', function(req, res) {
    console.log("Here is the request: " , req.params);
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public/', file));

});


app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Server is ready on port ' + app.get('port'));
});
