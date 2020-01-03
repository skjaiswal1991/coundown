var db = require('./../dbconnection');

site = {};

site._getadd = (req,res) => {
    var apikey = crypto.randomBytes(64).toString('hex');
    var companydata = '';
    db.query('select id,cname as name from company', function(err, results, fields) {

        if(err){
            console.log("Error"+err);
            throw err;

            //companydata = results;
        }else{
            companydata = results;
            res.render('dashboard/addsite',{ company : companydata, site:'', apikey: apikey});
        }
    })
   
   

}

site._postadd = ( req, res ) =>{
    fd = req.body;
    let sql ="INSERT INTO `site` (`company_id`, `name`, `address`, `city`, `state`, `street`, `zip`,`phone`, `country`, `status`) VALUES ('"+fd.company_id+"', '"+fd.name+"', '"+fd.address+"', '"+fd.city+"', '"+fd.state+"', '"+fd.street+"', '"+fd.zip+"','"+fd.phone+"', '"+fd.country+"', '"+fd.status+"')"; 
    db.query( sql, (err, result, fields) => {
        if(err){
            throw err;
        }else{
            res.redirect('/viewsite');
        }
    })

   // db.query("INSERT")
}

site._view = (req, res) => {

        db.query("SELECT s.*, c.cname as company_name FROM `site` as s INNER join company as c On c.id = s.company_id", (error, result, fields)=>{
            if(error)
                throw error;
            else
            res.render('dashboard/viewsite',{sitedata: result});

        })
}

site._getedit = ( req, res) => {
    id = req.params.id;
    companydata = "";
    db.query('select id,cname as name from company', function(error, result, fields) {
        if(!error){
                companydata = result;
                sql = "select * from site where id="+id;

                db.query(sql, function(error, results, fields ){
                        console.log(error);
                        if(!error){
                            res.render('dashboard/addsite',{ site: results[0], company: companydata });
                        }
                })
        }
    });
    //console.log("select * from site where id="+id);    
}

site._update = (req, res) =>{
    id= req.params.id;
    fd = req.body;
    var sql = "Update site SET company_id='"+fd.compa+"',name='"+fd.name+"', city ='"+fd.city+"',state='"+fd.state+"',street='"+fd.street+"',zip='"+fd.zip+"',country='"+fd.country+"',phone='"+fd.phone+"',address='"+fd.address+"',status='"+fd.status+"' where id = "+id;
    db.query(sql, (error, result, fields )=>{

        if(!error){
                res.redirect('/viewsite');
        }

    })
}

site._delete = (req,res) =>{
    id= req.params.id;
    fd = req.body;
    var sql = "delete from site  where id = "+id;
    db.query(sql, (error, result, fields )=>{

        if(!error){
                res.redirect('/viewsite');
        }

    })
}

module.exports = site;