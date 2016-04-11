var constants = require("./../app-config/constants.js");
AWS = require('aws-sdk');
var extend = require('deep-extend');

AWS.config.update({accessKeyId:constants.AWS_S3_ACCESS_KEY_ID,secretAccessKey:constants.AWS_S3_ACCESS_KEY_VALUE});
AWS.config.update({region:constants.AWS_S3_REGION});

var s3 = new AWS.S3();

function aws_s3(bucket_name){
  console.log("aws s3 storage client");
  this.mainBucket = bucket_name;
}

aws_s3.prototype.add = function(bucketKey,keyValue,callback) {
// console.log("aws s3 adding object to bucket");

 var bucketPath = this.mainBucket;

 s3.headBucket({Bucket:bucketPath},function(err,data){ // checks if it exists
   if(err){
     s3.createBucket({Bucket:bucketPath},function(err){
       if(err){
        console.log("error creating bucket: ", err);
        callback(err);
       }else{
         //console.log("successfully created bucket");

         var key = bucketKey;
         var params = {Bucket:bucketPath,Key:key,Body:keyValue};
         s3.upload(params, function(err, data) {
           if (err) {
             console.log("Error uploading data: ", err);
             callback(err);
           }else {
            // console.log("Successfully uploaded data to bucketKey ");
             callback(null);
           }
         });// upload
        }
     });//createBucket
   }else{
    // console.log("Bucket exists and we have access now");
     var key = bucketKey;
     var params = {Bucket:bucketPath,Key:key,Body:keyValue};
     s3.upload(params, function(err, data) {
      if (err) {
       console.log("Error uploading data: ", err);
       callback(err);
      }else {
          // console.log("Successfully uploaded data to bucketKey ");
          callback(null);
      }
     });
   }
  });//headBucket
}

aws_s3.prototype.deleteKey = function(key,callback){
   var params = {
                 Bucket: this.mainBucket,
                 Key: key
                };

   s3.headObject(params,function(err,data){
        if(err &&  err.code === 'Not Found'){
           console.log(key+" key not found");
           callback(null);
           return;
                    }

        s3.deleteObject(params,function(err,data){
               if(err){
                 console.log(err, err.stack);
                 callback(err);
                 return;
               }

              console.log(key+" deleted successfully");
              callback(null);
        });
   });
}

aws_s3.prototype.deleteKeys = function(keys,callback){
  console.log("delete aws s3 buckets and its keys");
  var params = {
                Bucket: this.mainBucket
               };
   params.Delete = {};
   params.Delete.Objects = [];

   for(var i=0;i
        params.Delete.Objects.push({Key: keys[i].Key});
   }

   s3.deleteObjects(params, function(err, data) {
     if (err){
        console.log(err);
        return callback(err);
     }

      callback(null);
      console.log(data.Deleted.length+" deleted ObjectKeys");
    });
}

aws_s3.prototype.list = function(params,callback){
  // merge json objects(key:value )

  var s3_params = extend({
                         Bucket: this.mainBucket
                         },params);

  s3.listObjects(s3_params, function(err, data) {
   if (err){
      console.log("There are no objects "+err);
      return callback(null);
   }

   var keys = [];
   data.Contents.forEach(function(content) {
  //   console.log(content.Key);
     keys.push({Key: content.Key});
    });

    callback(keys);
  });
}

module.exports = aws_s3


