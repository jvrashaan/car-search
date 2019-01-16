var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Get data from cache
router.get('/GET', function(req, res, next){
	var bod = req['headers']['params'];
	console.log(bod);
	app.con.query('SELECT webformatURL, user FROM PHOTOS WHERE query = ?', bod, function(error, results, fields){
		if(error){
		    throw error;
		}
		//console.log(results.insertId);
		//console.log("success");
		res.end(JSON.stringify(results));
	    });

    });

//Save data to the cache
router.post('/POST', function(req, res, next){
	var bod = req.body['cars'];
	var query = req.body['query'];
	for(var i = 0; j=bod.length, i < j; i++){
	    var id = bod[i]['id'];
	    var tags = bod[i]['tags'];
	    var webformatURL = bod[i]['webformatURL'];
	    var user = bod[i]['user'];
	    bod[i] = {webformatURL, tags, id,  query, user};
	    app.con.query('INSERT INTO PHOTOS SET ?', bod[i], function(error, results, fields) {
		    if(error){                                                                                            
			throw error;                                                                                      
		    }
		    //console.log(results.insertId);
		    //console.log("success");
		    res.end(JSON.stringify(results));                                                                     
		});
	}
    });

//delete data from the cache
router.delete('/DELETE', function(req, res, next){
	var bod = req['headers']['params'];
	app.con.query('DELETE FROM PHOTOS WHERE query = ?', bod, function(error, results, fields){
		if(error){
		    throw error;
		}
		//console.log(results.insertId);
		//console.log("success");
		res.end(JSON.stringify(results));
	    });
    });

//saves selected photos to the saved data table	    
router.post('/SAVE', function(req, res, next){
	var bod = req.body;
	app.con.query('INSERT INTO SAVED SET ?', bod, function(error, results, fields){
		if(error){
		    throw error;
		}
		console.log("success");
		res.end(JSON.stringify(results));
	    });
    });

//gets the saved photos from the saved data table
router.get('/SAVED', function(req, res, next){
	app.con.query('SELECT * FROM SAVED', function(error, results, fields){
		if(error){
		    throw error;
		}
		console.log("success");
		res.end(JSON.stringify(results));
	    });
    });

//pending comment functionality
router.post('/COMMENT', function(req, res, next){
	var comment = req.body['comment'];
	app.con.query('INSERT INTO PHOTOS SET ?', comment, function(error, results, fields){
		if(error){
		    throw error;
		}
		console.log("success");
		res.end(JSON.stringify(results));
	    });
    });

//retreives the recent search terms from saved photos and the cache 
router.get('/TAGS', function(req, res, next){
	app.con.query('SELECT DISTINCT (tags) FROM PHOTOS', 'SELECT DISTINCT (tags) FROM SAVED', function(error, results, fields){
		if(error){
		    throw error;
		}
		console.log("success");
		res.end(JSON.stringify(results));
	    });
    });

//removes a saved photo from the saved database
router.delete('/REMOVE', function(req, res, next){
	var bod = req['headers']['params'];
	app.con.query('DELETE FROM SAVED WHERE webformatURL = ?', bod, function(error, results, fields){
		if(error){
		    throw error;
		}
		console.log("success");
		res.end(JSON.stringify(results));
	    });
    });

module.exports = router;
