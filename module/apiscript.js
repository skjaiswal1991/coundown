var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
db = require('./../dbconnection');

var moment = require('moment');
const request = require('request');
//var forEach = require('async-foreach').forEach;
watchsection = {};

// Enterval to get update
watchsection._watchdata  =  async function(req,res,next){

    
    console.log("Interval working !");
      var data;
      var datetime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
      var company_id = '';

      await request('http://localhost/express/coundown/services.php', { json: true }, (err, res, body) => {
      
          if (err) { return console.log(err); }

          respaonseData = body;
          console.log(respaonseData);
          //return;
          //respaonseData.ForEach((data) => { 

         //var sql = "SELECT * FROM api as c INNER JOIN api_meta as cm On c.id = cm.company_id WHERE c.company_code = '"+data.customer_code+"'";
         let sql = "SELECT * from company as c inner join timer as t ON c.id = t.comp_id where c.apikey = '"+body.apikey+"' and c.id = '"+body.id+"' and t.timer_code = '"+body.timer_code+"'";
            //console.log(sql);
          
           db.query( sql,function( error,result,field){
                console.log(result);


                if( parseInt(result[0].set_time) !==  parseInt(body.set_time) || parseInt(result[0].status) !== parseInt(body.status) )
                {
                    let datetime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
                    console.log("change requrired");
                    //console.log(result);
                    var sql = "UPDATE timer SET  set_time = '"+body.set_time+"',status = '"+body.status+"',start_time = '"+datetime+"' WHERE comp_id = '"+result[0].comp_id+"' and timer_code = '"+body.timer_code+"'";
                    console.log(sql);
                    db.query(sql,function(error,result,fields){ 

                            if(!error){

                                var startDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
                                var endDate = moment(new Date(datetime)).format("YYYY-MM-DD hh:mm:ss");
                                var  remainSecond = moment(startDate).diff(endDate, 'seconds');

                                if( remainSecond > (body.set_time * 60) || body.status == 0 ){
                                    remainSecond = 0; 
                                }else{
                                    remainSecond = (parseInt(body.set_time) * 60) - remainSecond;
                                }
                                console.log(remainSecond);
                                var minuts = Math.floor(remainSecond / 60 );
                                var second = Math.floor(remainSecond % 3600 % 60);

                                returndata = {  
                                                minuts :minuts,
                                                second : second,
                                                status : body.status,
                                                remain_second:remainSecond,
                                                companyid: company_id, 
                                                timerid: body.timer_code
                                            };
                                console.log("return data form update");
                               
                                io.emit('newclientconnect',returndata);
                                   
                                             
                                // console.log(returndata);            
                            } 
                    });
                }

                 
            });
         //});
      });

    //   setTimeout(() => {
    //     watchsection._watchdata();
    //   }, 3000);
      
}

watchsection._coundowntimer = function(req,res){

    //io.emit("welcome",{data:"user Connected"});
    var returndata = new Array();

    //var sql = "SELECT * FROM api as c INNER JOIN api_meta as cm On c.id = cm.company_id where c.company_code = '"+req.params.id+"'";
    //let sql = "SELECT * from company as c inner join timer as t ON c.id = t.comp_id where c.apikey = '"+req.params.apikey+"' and c.id = '"+req.params.id+"'";
    sql="SELECT c.is_active,t.* from company as c inner join site as s on c.id = s.company_id inner join timer as t ON s.id = t.site_id where c.apikey = '"+req.params.apikey+"' and c.id = '"+req.params.id+"' and c.is_active = 1";

    console.log(sql);
    db.query(sql,function(error,result,fields){
        var lenth =(JSON.stringify(result).length);
        second = 1;
        if(lenth > 2){
            result.forEach(timerdata=>{

                //console.log(timerdata);
                var startDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
                var endDate = moment(new Date(timerdata.start_time)).format("YYYY-MM-DD hh:mm:ss");
                var remainSecond = moment(startDate).diff(endDate, 'seconds');
                let  times = timerdata.set_time.split(':');
                set_time = parseInt(times[0]) * 60 + parseInt(times[1]); 
    
                if( remainSecond > (parseInt(set_time)) || timerdata.event == 0 ){
                    remainSecond = 0; 
                }else{
                    remainSecond = (parseInt(set_time)) - remainSecond;
                }

                //console.log(remainSecond);
                
                var minuts = Math.floor(remainSecond / 60);
                var second = Math.floor(remainSecond % 3600 % 60);
                returndata.push({  
                                    minuts :minuts,
                                    second : second,
                                    status:timerdata.status,
                                    timer_code:timerdata.timer_code,
                                    remain_second:remainSecond,
                                    name: timerdata.name
                            });
                console.log(returndata);

            })
            res.render('viewpage',{returndata : returndata,msg: ''});
        }else{
            console.log("Im here");
            res.render('viewpage',{returndata : returndata,msg: "Your Subscription Expired, Please renew it."});
        }
        
        
    })
      
}

module.exports = watchsection;