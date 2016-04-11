// Added for twitter - AmitRodge
var constants = require("./app-config/constants.js");
twitterHandle = require("./app-backend/twitterfetch.js");
var thandle = new twitterHandle();

// Added for Twitter periodic task - AmitRodge
//This callback is called for each individual woeid i.e. city trends uploaded to aws s3
var finishCallback = function(error){
     if(error){
        console.log("parseNFetch Error");
     }else{
        /// Write Code here for HTML generation
        console.log("success to added to aws s3");
     }
}
var run = function(){
    console.log("Repeat at provided interval ");
    thandle.parseNfetch(finishCallback);
}
setInterval(run,constants.INTERVAL);


module.exports = app;

