const db = require('./../dbconnection');
var multer = require('multer');
var path = require('path');
const md5 = require('md5');
var Promise = require('promise');
var config = require('./../config');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.imagefilepath)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
  })

var upload = multer({ 
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.JPG' && ext !== '.PNG') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }
    }).single('image');

userdata = {};

userdata._profile = (req,res) =>{

    //upload.single();

    console.log(req.session);
    $sql = 'select * from users where id = '+req.session.user
    db.query($sql, function(error,result,fields){
        if(error) throw error;

        res.render('dashboard/profile',{udata:result[0]})
    })
}

userdata._update = (req,res) =>{
    //var imagename  = 

    upload(req,res,function(err){
        if (err instanceof multer.MulterError) {
                error = "File upload nor working";
          } else if (err) {
                error = "Only Allow jpg png jpeg images";
            // An unknown error occurred when uploading.
          }else{
              console.log(req.file);
                data = req.body,
                file = req.file;
                if(file){
                    sql = "update users set first_name='"+data.first_name+"',last_name='"+data.last_name+"',email='"+data.email+"',role='"+data.role+"',image_url='"+file.filename+"' where id="+req.session.user
                }else{
                    sql = "update users set first_name='"+data.first_name+"',last_name='"+data.last_name+"',email='"+data.email+"',role='"+data.role+"' where id="+req.session.user
                }
               // console.log(sql);
                db.query(sql, function(error,result,fields){

                if(error) throw error;
                res.redirect('/profile');
               })

                //console.log(res);
              //app.locals.errormsg = 'ksdjgfsfjsafhsa';

          }
    })
     //console.log(req);
    // data = req.body;
     //res.send(req);
     //$sql = 'update users ()'
}

userdata._changepassword = (req,res) =>{
    data = {status:'',msg:''}
    res.render('dashboard/changepassword',data);
}



userdata._updatepassword = (req,res) =>{
    const {password,confpassword} = req.body;
    data = {status:'',msg:''}
    if(password.length > 0 && confpassword.length > 0){
        console.log(confpassword);
        console.log(password);

        if(password === confpassword){
            let sql = "update users set password='"+md5(password)+"' where id="+req.session.user;
            db.query(sql,function(err,result,fields){
                if(err) throw err;
                console.log(result);
                data = {status:'Success',msg:'Password Change sucessfully'}
                // res.render('dashboard/changepassword',data);
                setTimeout(function(){
                    res.redirect('/logout');
                },3000)
            })
        }else{
            data = {status:'Error',msg:'Conform password Not matched'}

        }
        
    }else{
        data = {status:'Error',msg:'Please Enter password and conform password'}
    }

    if(data.status){
        res.render('dashboard/changepassword',data);
    }
    
}

module.exports = userdata;