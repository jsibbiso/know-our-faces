//var gm = require('gm');
var cloudinary = require('cloudinary');
//var io = require('socket.io');
 
module.exports = {
upload: function (req, res) {

    var userId = req.body['userId'];
    var photoId = null;
    if (!userId) return res.send("No id specified.", 500);
    
    async.series([
      
      //Get users current photoID for later deletion
      function(callback) {
        User.findOne(userId).done(function(err,user) {
            if (err) console.log("Couldn't find user");
            photoId = user.photoId;
        });
        callback();
      },
      
      function(callback) {
        
        //Upload new image  
        var file = req.files.userPhoto;
        cloudinary.uploader.upload(file.path, function(result) { 
            console.log(result);
            User.update(userId, {id:userId, photoPath:result['url'], photoId:result['public_id'], photoRotation:0}, function userUpdated(err, updatedUser) {  
                if (err) {
                    console.log('err error after uploading image');
                }
                if(!updatedUser) {
                    console.log('updated user error after uploading image');
                }
                callback();
            });
            },
            { height: 200, crop: "scale" }
        );
        
        //Remove old image from cloud
        if(photoId) {
            cloudinary.uploader.destroy(photoId, function(result) { 
                console.log(result) 
                }, 
                { invalidate: true }
            );
        }
      }], function(err) {
          //Series actions complete enough, continue UI
          return res.redirect('/user/'+userId);
      });

    },
    
    
    test: function (req, res) {
        return res.view();   
    },
/**
* Overrides for the settings in `config/controllers.js`
* (specific to GifController)
*/
_config: {}
};