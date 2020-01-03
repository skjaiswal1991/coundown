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
var apiscript = require('./module/apiscript');
var timer = require('./module/timer');
var cmp = require('./module/company');
var dashb = require('./module/dashboard');
var site = require('./module/site');
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
// show page all the company website
app.get('/showwatchdata/:apikey/:id', apiscript._coundowntimer);


app.post('/showwatchdata',function(req,res){
   res.render('viewpage',{resp: req.body.data});
})

// view dashboard section data
app.get('/dashboard', auth.middleware, dashb._view);

// view the add forms
app.get('/addcompany', auth.middleware, cmp._getadd);

// add company post request response
app.post('/addcompany', auth.middleware, cmp._postadd);

// view list of the company
app.get('/viewcompanys', auth.middleware, cmp._view);

//Edit company data 
app.get("/editcompany/:id",auth.middleware, cmp._getedit);

// update Company data
app.post("/editcompany/:id",auth.middleware, cmp._update);

// Delete Company Data
app.get('/deletecompany/:id',auth.middleware, cmp._delete);


//Add Timer to form section 
app.get('/addtimer',auth.middleware, timer._getadd)

// after submittng the form save data and update
app.post('/addtimer',auth.middleware, timer._postadd)

// Edit Timer data
app.get('/edittimer/:id',auth.middleware, timer._getedit);

//update the timer data
app.post('/edittimer/:id',auth.middleware,timer._update)

// Delete Timer Data
app.get('/deletetimer/:id',auth.middleware, timer._delete )

// View Timer Data
app.get('/viewtimers',auth.middleware, timer._view )

// update users profile 
app.get('/profile',auth.middleware,userdata._profile);
app.post('/profile',auth.middleware,userdata._update);
app.get('/changepass',auth.middleware,userdata._changepassword);
app.post('/changepass',auth.middleware,userdata._updatepassword);


// Add site 
app.get( '/addsite',site._getadd )
app.post( '/addsite', site._postadd )
app.get( '/editsite/:id', site._getedit )
app.post( '/editsite/:id', site._update )
app.get( '/deletesite/:id', site._delete )
app.get( '/viewsite', auth.middleware, site._view )

// Api setting

app.get('/apisetting',auth.middleware,apisett._api);
app.post('/apisetting',auth.middleware,apisett._apiupate);
app.get('/companyscript',auth.middleware,apisett._companyscript);

app.post('/genscript',auth.middleware,function(req,res){
    //console.log(req.body)
    console.log(req.body);
    cid = req.body.id;
    console.log('Select id,apikey from company where id='+cid);
    //res.json(JSON.stringify(req.body));

    db.query('Select id,apikey from company where id='+cid,function(error,result,fields){
            if(error) throw error;
            res.json({id:cid,key:result[0].apikey,script:config.script_url});
    })
    
})


app.post('/dashboard/adduser',function(req,res){
    console.log(req.body);
    res.render('dashboard/adduser');
})

app.get('/register',function(req,res){
    res.render('register');
})

// check the all username and password
app.post('/authentication', auth.authentication);  


async function _watchdata(){

    
    console.log("Interval working !");
      var data;
      var datetime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
      var company_id = '';

      await request(config.api_url, { json: true }, (err, res, body) => {
      
          if (err) { return console.log(err); }

          respaonseData = body;
          console.log(respaonseData);
          //return;
          //respaonseData.ForEach((data) => { 

         //var sql = "SELECT * FROM api as c INNER JOIN api_meta as cm On c.id = cm.company_id WHERE c.company_code = '"+data.customer_code+"'";
         let sql ="SELECT c.is_active,t.* from company as c inner join site as s on c.id = s.company_id inner join timer as t ON s.id = t.site_id where c.apikey = '"+body.apikey+"' and c.id = '"+body.id+"' and t.timer_code = '"+body.timer_code+"'";
         //let sql = "SELECT * from company as c inner join timer as t ON c.id = t.site_id where c.apikey = '"+body.apikey+"' and c.id = '"+body.id+"' and t.timer_code = '"+body.timer_code+"'  and t.timer_code = '"+body.timer_code+"'";

            //console.log(sql);
          
           db.query( sql,function( error,result,field){
                console.log(result);


                if( parseInt(result[0].set_time) !==  parseInt(body.set_time) || parseInt(result[0].status) !== parseInt(body.status) )
                {
                    let datetime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
                    //console.log("change requrired");
                    //console.log(result);
                    var sql = "UPDATE timer SET  set_time = '"+body.set_time+"',status = '"+body.status+"',start_time = '"+datetime+"' WHERE  timer_code = '"+body.timer_code+"'";
                    ///console.log(sql);
                    db.query(sql,function(error,result,fields){ 

                            if(!error){

                                var startDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
                                var endDate = moment(new Date(datetime)).format("YYYY-MM-DD hh:mm:ss");
                                var  remainSecond = moment(startDate).diff(endDate, 'seconds');
                                let  times = body.set_time.split(':');
                                var set_time = parseInt(times[0]) * 60 + parseInt(times[1]);
                                if( remainSecond > parseInt(set_time) || body.status == 0 ){
                                    remainSecond = 0; 
                                }else{
                                    remainSecond = parseInt(set_time) - remainSecond;
                                }
                                //console.log(remainSecond);
                                var minuts = Math.floor(remainSecond / 60 );
                                var second = Math.floor(remainSecond % 3600 % 60);

                                returndata = {  
                                                minuts :minuts,
                                                second : second,
                                                status : body.status,
                                                remain_second:remainSecond,
                                                companyid: company_id, 
                                                timerid: body.timer_code,
                                                name: result.name
                                            };
                                //console.log("return data form update");
                               
                                io.emit('newclientconnect',returndata);
                                   
                                             
                                // console.log(returndata);            
                            } 
                    });
                }

                 
            });
         //});
      });

      setTimeout(() => {
        _watchdata();
      }, 3000);
      
}


http.listen(PORT, function(){ 
   // _watchdata();
   console.log(PORT+' Server Start')
 });
