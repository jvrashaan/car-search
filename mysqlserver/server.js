var express = require('express');
var mysql = require('mysql');
var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "giggaman123",
        database: "CARPHOTOS"
    });
var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200
};
var Router = require('router');

const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.listen(8000, () => {
        console.log('Server started!');
    });

con.connect(function(err) {
        if (err) throw(err);
        console.log("Connected!");
    });

app.get('/', function(req, res) => {
        res.send({'Get Method'});
    });

app.post('/', function(req, res) => {
        res.send(201, req.body);
        console.log(req.body);
    });

app.route('/api/cars').get((req, res) => {
        res.send({});
    });

app.route('api/cars').post((req, res) => {
        res.send(201, req.body);
        console.log(req.body);
    });