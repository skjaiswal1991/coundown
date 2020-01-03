var MYLIBRARY = MYLIBRARY || (function(){
    var _args = {}; // private
    var _data = {}; 
    return {
        init : function(Args) {
           console.log(Args);
            _args = Args;

                $('#sharedata').append('<iframe width="100%" height="500px" src="http://localhost:3020/showwatchdata/'+Args[0]+'/'+Args[1]+'"></iframe>');
         }      
        
    };
}());

