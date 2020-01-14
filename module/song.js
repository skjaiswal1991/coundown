var db = require('../dbconnection');
var multer = require('multer');
var path = require('path');
const md5 = require('md5');
var Promise = require('promise');
var config = require('./../config');

song = {};

song._getadd =  function(req,res){
    var apikey = crypto.randomBytes(64).toString('hex');
    let sql = "select * from movies";
    db.query(sql,function(error,result,fields){
        var  data = result;
        res.render('dashboard/addsong',{songdata: "", apikey: apikey,movies:data});
    })      
           
}

song._postadd = function( req, res ){

    console.log(req.files);
    console.log(req.body);
    fdata = req.body;
    files = req.files;
    console.log(files.cover[0].filename);
    //res.render('dashboard/addsong');
    //if(req.files)
      let sql = "Insert into songs (name,singer,cover,songs,movie_id,status)VALUES('"+fdata.name+"','"+fdata.singer+"','"+files.cover[0].filename+"','"+files.songs[0].filename+"','"+fdata.movie_id+"','"+fdata.status+"')";
    console.log(sql);
    db.query(sql, function(err, result, fields){
        if(!err){
            res.redirect('/viewsongs');
        }
        console.log(err);
    })

}

song._getedit = function( req, res){
    console.log(req.params.id);
    let sql = "select * from movies";
    db.query(sql,function(error,result,fields){
        var  data = result;
        if(!error){
            let sql = "SELECT * from songs where id ="+req.params.id
            db.query(sql, function(err, results, fields){
                console.log(data);
                res.render('dashboard/addsong',{songdata: results[0],movies:data});
            })
        }else{
            console.log("Error");
        }
        
    })
        

}

song._update = function( req, res){
    pdata = req.body;
    files = req.files;
    console.log(files.cover);
    
    if( files.cover !== undefined){
        var sql = "update songs Set name = '"+pdata.name+"',singer = '"+pdata.website+"',cover = '"+files.cover[0].filename+"',songs='"+files.songs[0].filename+"',movie_id='"+pdata.movie_id+"',status='"+pdata.status+"' where id ="+req.params.id
    }else{
        var sql = "update songs Set name = '"+pdata.name+"',singer = '"+pdata.website+"',movie_id='"+pdata.movie_id+"',status='"+pdata.status+"' where id ="+req.params.id
    }
    
    console.log(sql);
    db.query(sql, function(err, results, fields){
        res.redirect('/viewsongs');
    })

}

song._delete = function( req,res){

    id = req.params.id;
    db.query('delete from songs where id = '+id, function( err, results, fields){
        if(!err){
            res.redirect('/viewsongs');
        }
    });

}

song._view = function(req,res){
    db.query("SELECT * from songs", function(err, results, fields){
        console.log(results);
        if(!err){
            res.render('dashboard/viewsongs',{songdata: results});
        }
    });
}

song._getallsongs = function(req,res){
    db.query("SELECT * from songs", function(err, results, fields){
        //console.log(results);
        if(!err){
            res.json(results);
        }
    });
} 

song._getallmovies = function(req,res){
    db.query("SELECT * from movies", function(err, results, fields){
        if(!err){
            res.json(results);
        }
    });
}

song._getmoviesong = function(req,res){
    id = req.params.id;
    db.query('Select * from songs where movie_id = '+id, function(err, results, fields){
        if(!err){
            res.json(results);
        }
    });
}

module.exports = song;