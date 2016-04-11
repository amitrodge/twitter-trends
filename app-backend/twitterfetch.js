var constants = require("./../app-config/constants.js");
 var twitter = require('twitter');
 var fs = require('fs');
 var path = require('path');

 aws = require("./../app-util/aws_s3.js");
 var aws_client = new aws(constants.BUCKET_NAME);

 function twitterHandle(){
  this.client = new twitter({consumer_key: constants.TWITTER_CONSUMER_KEY,
                         consumer_secret: constants.TWITTER_CONSUMER_SECRET,
                         access_token_key: constants.TWITTER_ACCESS_TOKEN_KEY,
                         access_token_secret: constants.TWITTER_ACCESS_TOKEN_SECRET,
                         });
 }

 twitterHandle.prototype.get_aws_client = function(){
  return aws_client;
 }

 twitterHandle.prototype.twitterFetchNUploadTos3 =  function(cityWoeid,callback){
    this.client.get('trends/place.json',{id:cityWoeid},function(error,data,response){
        if(error){
         console.log(error);
         throw error;
        }
        //console.log(data);// this data is an json object
        var locationArray = data[0].locations;
        var cityName = locationArray[0].name;
        var cityWoeid = locationArray[0].woeid;
        var objectKey = "trends/"+cityName+"-"+cityWoeid+".json"
        //var objectValue = JSON.stringify(data);
        console.log("Updating bucket for "+objectKey);

        aws_client.deleteKey(objectKey,function(err){
           if(err){
             console.log(err);
             throw err;
           }
            var objectValue = JSON.stringify(data);
            aws_client.add(objectKey,objectValue,function(err){
                 if(err){
                   console.log(err);
                   throw err;
                 }
                 callback(err);
            });//end of add key
        });// end of deleteKey
     });//end of twitterclient get function
 }


 var parseTrendLocationsJson = function(callback){
    var filePath = path.join(__dirname,constants.TRENDING_LOCATIONS_JSON_PATH);
    var jsonData = fs.readFileSync(filePath,"utf-8");
    var trendLocations  = JSON.parse(jsonData);
    var lArray = trendLocations.locations;
    for(var location=0;location
        var country = lArray[location].country;
        console.log(country);
        var cityList = lArray[location].trendingCities;
         for(var city=0;city
           var cityName = cityList[city].name;
           var cityWoeid =  cityList[city].woeid;
           this.twitterFetchNUploadTos3(cityWoeid,callback);
         }//end of inner for loop
     }//end of outer for loop
 }

 twitterHandle.prototype.parseNfetch = parseTrendLocationsJson;

/*
 twitterHandle.prototype.twitterFetchNUploadTos3 =  function(cityWoeid){
    this.client.get('trends/place.json',{id:cityWoeid},function(error,data,response){
        if(error){
         console.log(error);
         throw error;
        }
       console.log(data);// this data is an json object
       var locationArray = data[0].locations;
       var cityName = locationArray[0].name;
       var cityWoeid = locationArray[0].woeid;
       var objectKey = "trends/"+cityName+"-"+cityWoeid+".json"
       var objectValue = JSON.stringify(data);
        console.log("Updating bucket for "+objectKey);
        aws_client.add(objectKey,objectValue);
       });//end of twitterclient get function
  }



 twitterHandle.prototype.parseTrendLocationsJson = function(filePath){
    var jsonData = fs.readFileSync(filePath,"utf-8");
    var trendLocations  = JSON.parse(jsonData);
    var lArray = trendLocations.locations;
    for(var location=0;location
        var country = lArray[location].country;
        console.log(country);
        var cityList = lArray[location].trendingCities;
         for(var city=0;city
           var cityName = cityList[city].name;
           var cityWoeid =  cityList[city].woeid;
           this.twitterFetchNUploadTos3(cityWoeid);
                                                                        
         }//end of inner for loop
     }//end of outer for loop
 }

 twitterHandle.prototype.deleteStat = function(error){
   if(error){
        console.log(error);
        throw new Error("AWS s3 bucket deleteObjects error produced");
   }
   var filePath = path.join(__dirname,constants.TRENDING_LOCATIONS_JSON_PATH);
   this.parseTrendLocationsJson(filePath);
 }

 twitterHandle.prototype.deleteKeys = function(keys,callback){
   if(null == keys){
        console.log("getList from s3 bucket got error");
        throw new Error("AWS s3 bucket getList error produced");
   }
   if(keys.length == 0){
    console.log("no keys exist in bucket");
    //var filePath = path.join(__dirname,'trendlocations.json');
    //this.parseTrendLocationsJson(filePath);
    callback(null);
    return;
   }
   console.log(keys);
   //aws_client.delete(keys,getDeleteStat);
    aws_client.delete(keys,function(error){
        callback(error);
    });
 }
*/

module.exports = twitterHandle
