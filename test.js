var testcommon  = {};

testcommon.testdata = (req, res, next) =>{
    console.log(" I am in testdata function");
    //next();
}

testcommon.testsucess = (req, res, next)=>{

    console.log('I am im testdata sucess');
    next();
}

//console.log(testcommon);
module.exports = testcommon;