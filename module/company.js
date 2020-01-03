var db = require('./../dbconnection');

company = {};

company._getadd =  function(req,res){
    var apikey = crypto.randomBytes(64).toString('hex');
    res.render('dashboard/addcompany',{companydata: "", apikey: apikey});
}

company._postadd = function( req, res ){
    console.log(req.body);
    pdata = req.body;
    console.log(pdata);
    //res.render('dashboard/addcompany');
    let sql = "Insert into company (cname,website,email,phone,country,state,street,city,apikey,address,zip,is_active)VALUES('"+pdata.cname+"','"+pdata.website+"','"+pdata.email+"','"+pdata.phone+"','"+pdata.country+"','"+pdata.state+"','"+pdata.street+"','"+pdata.city+"','"+pdata.apikey+"','"+pdata.address+"','"+pdata.zip+"','"+pdata.status+"')";
    console.log(sql);
    db.query(sql, function(err, result, fields){
        if(!err){
            res.redirect('/viewcompanys');
        }
        console.log(result);
    })

}

company._getedit = function( req, res){
    console.log(req.params.id);
    let sql = "SELECT * from company where id ="+req.params.id
    db.query(sql, function(err, results, fields){
        res.render('dashboard/addcompany',{companydata: results[0]});
    })

}

company._update = function( req, res){
    pdata = req.body;
    let sql = "update company Set cname = '"+pdata.cname+"',website = '"+pdata.website+"',email ='"+pdata.email+"',phone ='"+pdata.phone+"', country ='"+pdata.country+"', state='"+pdata.state+"',street='"+pdata.street+"',address='"+pdata.address+"',city='"+pdata.city+"',apikey='"+pdata.apikey+"',is_active='"+pdata.status+"' where id ="+req.params.id
    console.log(sql);
    db.query(sql, function(err, results, fields){
        res.redirect('/viewcompanys');
    })

}

company._delete = function( req,res){

    id = req.params.id;
    db.query('delete from company where id = '+id, function( err, results, fields){
        if(!err){
            res.redirect('/viewcompanys');
        }
    });

}

company._view = function(req,res){
    db.query("SELECT * from company", function(err, results, fields){
        console.log(results);
        if(!err){
            res.render('dashboard/viewcompanys',{companydata: results});
        }
    });
}

module.exports = company;