var db = require('./../dbconnection'); 

timers = {};

timers._getadd = function(req,res){
    db.query("select id,name from site", function(error, results, fields){
        if(!error){
            var key = crypto.randomBytes(18).toString('hex');
            res.render('dashboard/addtimer',{cdata: results, data: "",timer_code: key});
        }
    })    
}

timers._postadd= function( req, res){
    data = req.body;
    db.query("INSERT INTO `timer` (`site_id`, `timer_code`, `set_time`,`name`, `status`) VALUES ('"+data.site_id+"', '"+data.timercode+"', '"+data.settime+"','"+data.name+"','"+data.status+"')", function(error, result,fields){
        console.log(error);
        if(!error){
            res.redirect("/viewtimers");
        }
    })
}

timers._getedit = function(req, res){

    let id = req.params.id;
    var cdata;
    db.query("select id,name from site", function(error, results, fields){
            
            if(!error){
                companylist = results;
                db.query("SELECT * from timer where id = "+id, function(error, result, fields){
                    if(!error){
                         let data = result[0];
                         console.log("I am herer ");
                         res.render('dashboard/addtimer',{ data: data,   cdata:  companylist,timer_code : ''});
                    }
                })
            }
    });
    
}

timers._update = function(req, res){

    let id = req.params.id;
    resdata  = req.body;
    db.query("update timer set site_id = '"+resdata.site_id+"', timer_code = '"+resdata.timercode+"', set_time = '"+resdata.settime+"', name = '"+resdata.name+"', status = '"+resdata.status+"' where id = '"+id+"'", function(error, results, fields){
            
        if(!error){
            res.redirect('/viewtimers');
            //timers._view;
        }
    });
    
} 

timers._delete = function(req,res){
    id = req.params.id;
    sql =  "Delete from timer where id = '"+id+"'";  
    console.log(sql); 
    db.query(sql, function (error, result, fields){
        if(!error){
           res.redirect('/viewtimers');
        }
    })
}

timers._view = function(req,res){
    db.query("SELECT t.*,s.name as site_name, c.cname as company_name FROM `site` as s INNER join company as c On c.id = s.company_id inner join timer as t on s.id = t.site_id",function( error, result,fields){
        console.log(result);
        if(!error){
            res.render("dashboard/viewtimers",{tdata: result});
        }
    })
}

module.exports = timers;