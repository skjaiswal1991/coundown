var express = require('express');
crypto = require('crypto')
var app = express();
var PORT = 3020;
const axios = require('axios');
var http = require('http').Server(app);
var forEach = require('async-foreach').forEach;
let config = require('./config');
var db = require('./dbconnection'); 
var test = require('./test');
var io = require('socket.io')(http);
var routes = require('./routes')(io);
var multer = require('multer');
var path = require('path')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname == 'songs'){
            cb(null, config.songsfilepath)
        }else{
            cb(null, config.imagefilepath)
        }
      
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
  })

var upload = multer({ 
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(file.fieldname == 'cover'){
                if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.JPG' && ext !== '.PNG' ) {
                    return callback(new Error('Only images are allowed'))
                }
            }else if(file.fieldname == 'songs'){
                if( ext !== '.mp3' ) {
                    return callback(new Error('Only Mp3 are allowed'))
                }
            }
            callback(null, true)
        }
    })



var moment = require('moment');
app.use(config.header);

var cookieParser = require('cookie-parser')
var session = require('express-session')
//const server = require('http').createServer();
const request = require('request');
// add view Engin
app.set('view engine', 'ejs'); 
app.use(express.static('public'));
// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

app.use( session({
    key: 'user_id',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
}))




app.use('/', function(req,res,next){
    if(req.session.user && req.session.token){
        const sql = 'select * from users where id='+req.session.user
        db.query(sql,function(error,result,field){
            if( error ) throw error;
            const { first_name,last_name,image_url,email} = result[0];
            app.locals ={
               username: first_name+' '+last_name,
               img:image_url
            }
        })
        
    }
    next();
})


//Get the html form request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
let middlew = require('./middleware');
// modules added 
var auth = require('./module/auth');
var song = require('./module/song');
var movie = require('./module/movie')
var dashb = require('./module/dashboard');

const userdata = require('./module/users.js'); 
const apisett = require('./module/apisetting');


// Default open page when website open
app.get('/',middlew.checksession,function(req,res){
    status = { success: true, responce: '',msg:''};
    res.render('index',status);
})

//app logout 
app.get("/logout", auth.logout);

io.on('connection', function(socket) {
    console.log('A user connected');
        //socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
});


app.post('/showwatchdata',function(req,res){
   res.render('viewpage',{resp: req.body.data});
})

// view dashboard section data
app.get('/dashboard', auth.middleware, dashb._view);

// view the add forms

// add company post request response


// view list of the songs
app.get('/addsongs', auth.middleware, song._getadd);
app.post('/addsongs',auth.middleware,upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'songs', maxCount: 1 }]), song._postadd);
app.get('/viewsongs', auth.middleware, song._view);
app.get('/editsong/:id', auth.middleware, song._getedit);
app.post('/editsong/:id', auth.middleware,upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'songs', maxCount: 1 }]), song._update);
app.get('/deletesong/:id', auth.middleware, song._delete);


// Movies serction Start 

app.get('/addmovie', auth.middleware, movie._getadd);
app.post('/addmovie', auth.middleware,upload.fields([{ name: 'cover', maxCount: 1 }]), movie._postadd);
app.get('/viewmovies',auth.middleware, movie._view);
//app.get('/editmovie', auth.middleware, movie._edit);
// app.get('/viewsongs', auth.middleware, movie._delete);
// app.get('/viewsongs', auth.middleware, movie._view);


// get songs list for API Perpose

app.get('/allsong',song._getallsongs);
app.get('/allmovies',song._getallmovies);
app.get('/moviesong/:id',song._getmoviesong);




// update users profile 
app.get('/profile',auth.middleware,userdata._profile);
app.post('/profile',auth.middleware,userdata._update);
app.get('/changepass',auth.middleware,userdata._changepassword);
app.post('/changepass',auth.middleware,userdata._updatepassword);



app.post('/dashboard/adduser',function(req,res){
    console.log(req.body);
    res.render('dashboard/adduser');
})

app.get('/register',function(req,res){
    res.render('register');
})

// check the all username and password
app.post('/authentication', auth.authentication);  


http.listen(PORT, function(){ 
   // _watchdata();
   console.log(PORT+' Server Start')
 });
