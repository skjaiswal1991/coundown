var db = require('../dbconnection');
var multer = require('multer');
var path = require('path');
const md5 = require('md5');
var Promise = require('promise');
var config = require('./../config');

company = {};

company._getadd =  function(req,res){
    var apikey = crypto.randomBytes(64).toString('hex');
    res.render('dashboard/addsong',{companydata: "", apikey: apikey});
}

company._postadd = function( req, res ){

    console.log(req.files);
    console.log(req.body);
    fdata = req.body;
    files = req.files;
    console.log(files.cover[0].filename);
    //res.render('dashboard/addcompany');
    //if(req.files)
      let sql = "Insert into songs (name,singer,cover,songs)VALUES('"+fdata.name+"','"+fdata.singer+"','"+files.cover[0].filename+"','"+files.songs[0].filename+"')";
    console.log(sql);
    db.query(sql, function(err, result, fields){
        if(!err){
            res.redirect('/viewsongs');
        }
        console.log(err);
    })

}

company._getedit = function( req, res){
    console.log(req.params.id);
    let sql = "SELECT * from company where id ="+req.params.id
    db.query(sql, function(err, results, fields){
        res.render('dashboard/addcompany',{companydata: results[0]});
    })

}

company._update = function( req, res){
    pdata = req.body;
    let sql = "update company Set cname = '"+pdata.cname+"',website = '"+pdata.website+"',email ='"+pdata.email+"',phone ='"+pdata.phone+"', country ='"+pdata.country+"', state='"+pdata.state+"',street='"+pdata.street+"',address='"+pdata.address+"',city='"+pdata.city+"',apikey='"+pdata.apikey+"',is_active='"+pdata.status+"' where id ="+req.params.id
    console.log(sql);
    db.query(sql, function(err, results, fields){
        res.redirect('/viewcompanys');
    })

}

company._delete = function( req,res){

    id = req.params.id;
    db.query('delete from company where id = '+id, function( err, results, fields){
        if(!err){
            res.redirect('/viewcompanys');
        }
    });

}

company._view = function(req,res){
    db.query("SELECT * from songs", function(err, results, fields){
        console.log(results);
        if(!err){
            res.render('dashboard/viewsongs',{companydata: results});
        }
    });
}

company._getallsongs = function(req,res){
    db.query("SELECT * from songs", function(err, results, fields){
        //console.log(results);
        if(!err){
            res.json(results);
        }
    });
} 

module.exports = company;