var db = require('./../dbconnection'); 
let jwt = require('jsonwebtoken');
const md5 = require('md5');
var auth = {};

auth.authentication = function(req,res,next){

    if(req){

        db.query("Select * from users where email = '"+req.body.email+"' and password = '"+md5(req.body.password)+"'",function(error,result,fields){
            //console.log(result);
            if( result.length > 0 ){
                console.log(result[0].id);
                token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
                req.session.user = result[0].id;
                req.session.token = token;
                res.redirect('/dashboard');

            }else{
                res.render('index',{success: false,responce: 'Authentication Unsuccessful!',msg:'Please check username and password'});
      
            }
        })
    }
    
}
auth.logout = function(req, res){
    console.log("I am in logout section");
    req.session.destroy(function(error){
        if(error){
            console.log("Session data not distroy");
        }else{
            res.redirect("/");
        }

    })
}
auth.middleware = function middleware (req, res, next) {
    console.log(req.session.user);
    if(req.session.user && req.session.token){
        next();
    }else{
        res.redirect('/');
    }
}



module.exports = auth;


