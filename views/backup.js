// group connection data
//var xyz = io.of('/namespace');

// var roomno = 1;
// io.on('connection', function(socket) {
   
//    //Increase roomno 2 clients are present in a room.
//    if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
//    socket.join("room-"+roomno);

//    //Send this event to everyone in the room.
//    io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
//    io.sockets.emit("room-"+roomno,{descriptio:'room servides'});
// })

// xyz.on('connection',function(socket){
//     console.log('someone connected');
//     xyz.emit('hi','new you are connected');
//     xyz.broadcast.emit('hi',{data:"sanjay"});
// })

//Whenever someone connects this gets executed
// io.on('connection', function(socket) {


//     clients++;
//    socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
//    socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
//    socket.on('disconnect', function () {
//       clients--;
//       socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
//    });


    // console.log('A user connected');
    
    // socket.on('testerEvent',function(data){
    //     console.log(data);
    // })
    // //socket.send("hello this is a first message");
    // //socket.emit('testerEvent',{messagedata:'its a part of emmit message'});
    // //Whenever someone disconnects this piece of code executed
    // socket.on('disconnect', function () {
    //    console.log('A user disconnected');
    // });
 //});

 // io.on('connect', client => {
//   //client.on('event', data => { console.log('data') });
//   //client.on('disconnect', () => { console.log('data') });
// });


// checkdata = (cust_num, timer_num) = {

//     db.query("Select * from users where email = '"+req.body.email+"' and password = '"+req.body.password+"'",function(error,result,fields){
//         console.log(result);
//         if( result.length > 0 ){
//             console.log(result);
//             let token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
//             res.redirect('/dashboard');
            
//         }else{
//             res.render('index',{success: false,responce: 'Authentication Unsuccessful!',msg:'Please check username and password'});
  
//         }
//     })
// }

// io.on('connection',function(socket){
    
//     socket.emit('update',{description:"",port:'header1',timer:134})
// })
 

// http.listen(3000, function() {
//     console.log('listening on *:3000');
//  });


var express = require('express');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var db = require('./dbconnection'); 
//var io = require('socket.io')(http);
var https = require('https')
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

const server = require('http').createServer();
const request = require('request');
//const io = require('socket.io')(server);
//var clients = 0;
//var disconnect = 0; 
//var data = 1;

var datetime = new Date();

    //console.log(datetime.toISOString().slice(0,19));
console.log(Date('now'));

// Enterval to get update
setInterval(function(){
        var data;

        request('http://localhost/express/coundown/services.php', { json: true }, (err, res, body) => {
        
            if (err) { return console.log(err); }
            data = body;
            var sql = "SELECT * FROM company as c INNER JOIN company_meta as cm On c.id = cm.company_id WHERE c.company_code = '"+data.customer_code+"' and cm.timer_code = '"+data.timer_code+"'";
            console.log(sql);

            db.query( sql,function( error,result,field){
            
                    if(!result || result.length == 0 ){
                        var sql = "Insert Into company (name,company_code) VALUE('"+data.customer_code+"','"+data.customer_code+"')";
                    
                        db.query(sql,function( error,result,field){

                            let company_id = result.insertId;
                            if(company_id){
                                var sql = "Insert Into company_meta (company_id,timer_code,set_time,start_time,event) VALUE ('"+company_id+"','"+data.timer_code+"','"+data.set_time+"','"+datetime+"','"+data.event+"')";
                                db.query(sql,function( error,result,field){
                                    //console.log(error);
                                    console.log(result);
                                })
                            }

                        });
                    
                    }else{

                        console.log(result);
                        if( result.set_time !==  data.set_time || result.event !== data.event ){
                            var sql = "update company,company_meta as cm INNER join company as c On c.id = cm.company_id SET cm.event = '"+data.event+"' where c.company_code = '"+data.customer_code+"'";
                            db.query(sql,function(error,result,fields){
                                if(error)
                                throw error;

                            }) 
                        }
                            //if(result.)

                    }
               
            });
        });
},700000);

// add view Engin
app.set('view engine', 'ejs');

//Set the path public folder
app.use(express.static('public'));

// get the html form request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',function(req,res){
    status = { success: true, responce: '',msg:''};
    res.render('index',status);
})

app.get('/dashboard',function(req,res){
    
    let allusers;
    db.query('Select * from users',function(error,result,fields){
        if( !error ){
            console.log(result);
            allusers = result;
            res.render('dashboard/dashboard',{userdata: allusers });
        }else{
            console.log(error.sqlMessage);
        }
    })
    
    
})

app.get('/dashboard/adduser',function(req,res){
    res.render('dashboard/adduser');
})


app.post('/dashboard/adduser',function(req,res){
    console.log(req.body);
    res.render('dashboard/adduser');
})

app.get('/register',function(req,res){
    //console.log(req.body);
    //uservalidation(req.body)
    res.render('register');
    
})

app.post('/authentication',function(req,res){
    console.log(req.body);

    status = {};
    console.log(req.body);
    if(req){

        db.query("Select * from users where email = '"+req.body.email+"' and password = '"+req.body.password+"'",function(error,result,fields){
            console.log(result);
            if( result.length > 0 ){
                console.log(result);
                let token = jwt.sign({username: req.body.email},config.secret,{ expiresIn: '24h'});
                res.redirect('/dashboard');
                
            }else{
                res.render('index',{success: false,responce: 'Authentication Unsuccessful!',msg:'Please check username and password'});
      
            }
        })
    }
    
   // console.log(status);
   // res.render('dashboard/dashboard');
    
})

app.listen(3000);



   /* minuts = '<%=minuts%>';
    second = '<%=second%>';
    getdata =  {event:'<%=event%>'}; */

    
    var row = returndata;
    console.log(row);
    for (var i in row) {
        console.log(row[i]);
    }
    
    
    //countdown(minuts,second);


    
                                // if( parseInt(result[i].set_time) !==  parseInt(timerdata.set_time) || parseInt(result[i].event) !== parseInt(timerdata.event) ){
                                //     var sql = "update company,company_meta as cm INNER join company as c On c.id = cm.company_id SET cm.event = '"+data.event+"', cm.set_time = '"+data.set_time+"', cm.start_time = '"+datetime+"' where c.company_code = '"+data.customer_code+"'";
                                //     //console.log(sql);
                                //     db.query(sql,function(error,result,fields){
        
                                //             if(!error){

                                //                 var startDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
                                //                 var endDate = moment(new Date(datetime)).format("YYYY-MM-DD hh:mm:ss");
                                //                 var  remainSecond = moment(startDate).diff(endDate, 'seconds');
                                //                 console.log(result);

                                //                 if( remainSecond > (data.set_time * 60) || data.event == 0 ){
                                //                     remainSecond = 0; 
                                //                 }else{
                                //                     remainSecond = (parseInt(data.set_time) * 60) - remainSecond;
                                //                 }

                                //                 var minuts = Math.floor(remainSecond / 60 );
                                //                 var second = Math.floor(remainSecond % 3600 % 60);

                                //                 returndata  = {  
                                //                                 minuts :minuts,
                                //                                 second : second,
                                //                                 event : data.event,
                                //                                 remain_second:remainSecond,
                                //                                 companyid: data.customer_code,
                                //                                 timerid: data.timer_code
                                //                             };
                                //                 //console.log(returndata)
                                //                 io.emit('newclientconnect',returndata);
                                //             }    

                                //     }) 

                                    
                                // }
                               

                                var timeoutHandle;
                                function countdown(minutes,second) {
                                    //console.log(getdata.event);
                                    //console.log("hertert jsdfbjsdf");
                                    //id = viewid;
                                    if(minutes == 0 && second == 0){
                                        var seconds = 0;
                                        var mins = 0;
                                    }else{
                                        var seconds = second == 0 ? 59 : second;
                                        var mins = minutes;
                                    }
                                    if(parseInt(getdata.event) === 0){
                                        mins = 1;
                                        seconds = 0;
                                    }
                                    
            
                                    function tick() {
                                        var counter = document.getElementById("timer_<%=returndata[i].timer_code%>");
                                        var current_minutes = (mins > 0 ? mins: 1) - 1;                           
                                        if(seconds > 0)
                                            seconds--;
            
                                        CurrentMinuts  =  current_minutes < 10 ? "0"+current_minutes : current_minutes.toString();
                                            counter.innerHTML = CurrentMinuts.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
                                        if( seconds > 0 ) {
                                            timeoutHandle=setTimeout(tick, 1000);
                                        } else {
            
                                            if(mins > 1){
            
                                            // countdown(mins-1);   never reach “00″ issue solved:Contributed by Victor Streithorst
                                            timeoutHandle = setTimeout(function () { countdown(mins - 1,0); }, 1000);
            
                                            }
                                        }
                                    }
            
                                    clearTimeout(timeoutHandle);
            
                                    tick();
                                }