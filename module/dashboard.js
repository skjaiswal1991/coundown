db = require('./../dbconnection');

dashboard = {};

dashboard._view = function(req,res){
    console.log('dashboard');
    $sql = 'SELECT count(c.id) as company,count(s.id) as site,count(t.id) as timers FROM `company` as c inner join site as s on s.company_id = c.id INNER join timer as t on t.site_id = s.id';
    db.query($sql,function(error,result,fields){
       if( !error ){
           console.log(result[0].company);
           const { company,site,timers} = result[0];

           res.render('dashboard/dashboard',{company:company,site:site,timer:timers});
       }else{
           console.log(error.sqlMessage);
       }
   });
}


module.exports = dashboard;