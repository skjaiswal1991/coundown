var db = require('../dbconnection');
var multer = require('multer');
var path = require('path');
const md5 = require('md5');
var Promise = require('promise');
var config = require('./../config');

movies = {};

movies._getadd =  function(req,res){
    var apikey = crypto.randomBytes(64).toString('hex');
    res.render('dashboard/addmovie',{moviedata: "", apikey: apikey});
}

movies._postadd = function( req, res ){

    console.log(req.files);
    console.log(req.body);
    fdata = req.body;
    files = req.files;
    console.log(files);
    console.log(files.cover[0].filename);
    //res.render('dashboard/addmovies');
    //if(req.files)
      let sql = "Insert into movies(name,singer,img,year)VALUES('"+fdata.name+"','"+fdata.singer+"','"+files.cover[0].filename+"','"+fdata.year+"')";
    console.log(sql);
    db.query(sql, function(err, result, fields){
        if(!err){
            res.redirect('/viewsongs');
        }
        console.log(err);
    })

}

movies._getedit = function( req, res){
    console.log(req.params.id);
    let sql = "SELECT * from movies where id ="+req.params.id
    db.query(sql, function(err, results, fields){
        res.render('dashboard/addmovies',{moviesdata: results[0]});
    })

}

movies._update = function( req, res){
    pdata = req.body;
    let sql = "update movies Set cname = '"+pdata.cname+"',website = '"+pdata.website+"',email ='"+pdata.email+"',phone ='"+pdata.phone+"', country ='"+pdata.country+"', state='"+pdata.state+"',street='"+pdata.street+"',address='"+pdata.address+"',city='"+pdata.city+"',apikey='"+pdata.apikey+"',is_active='"+pdata.status+"' where id ="+req.params.id
    console.log(sql);
    db.query(sql, function(err, results, fields){
        res.redirect('/viewmoviess');
    })

}

movies._delete = function( req,res){

    id = req.params.id;
    db.query('delete from movies where id = '+id, function( err, results, fields){
        if(!err){
            res.redirect('/viewmoviess');
        }
    });

}

movies._view = function(req,res){
    db.query("SELECT m.*,count(s.movie_id) as total FROM `movies` as m inner join songs as s On s.movie_id = m.id group BY s.movie_id", function(err, results, fields){
        console.log(results);
        if(!err){
            res.render('dashboard/viewmovies',{moviesdata: results});
        }
    });
}


module.exports = movies;