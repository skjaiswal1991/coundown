const db = require('./../dbconnection');
const config = require('./../config');
const apisetting = {}

apisetting._api = (req,res) =>{
    //console.log("image");
    setting = {status:'',msg:"",url:'',config:config.api_url}
    db.query('Select * from setting', function(err,result,fields){
        if(err) throw err;
        console.log("API page");
        console.log(result);
        setting.url = result[0].url;
         console.log(setting);
        res.render('dashboard/apisetting',setting);
    })

    //res.render('dashboard/apisetting',setting);
}

apisetting._apiupate = (req,res) =>{
    setting = {status:'',msg:"",url:'',config:config}
    data = req.body;
    db.query('Select * from setting', function(err,result,fields){
        if(err) throw err;
        console.log(result.length);
        console.log(result);
        if(result.length === 0){
            db.query("Insert into setting  (url)Value('"+data.url+"')",function(error,result,fields){
                if(error) throw error;
                console.log("insert the setting");
                res.render('dashboard/apisetting',setting);
            })
        }else{
            db.query("Update setting SET url='"+data.url+"' where id="+result[0].id,function(error,result,fields){
                if(error) throw error;
                console.log("update the setting");
                //res.render('dashboard/apisetting',setting);
                res.redirect('/apisetting');
            })
        }
    })
   // if()
    
}

apisetting._companyscript = (req,res) =>{

    db.query('select id,cname as name from company', function(error,result,fields){
        if(error) throw error;
        res.render('dashboard/companyscript',{data:result,script:config.script_url});
    })
    console.log(' I am here Company script');
}

module.exports = apisetting;