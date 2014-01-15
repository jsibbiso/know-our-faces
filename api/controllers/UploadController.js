var sid = require('shortid');
var fs = require('fs');
var mkdirp = require('mkdirp');
var gm = require('gm');
//var io = require('socket.io');
 
var UPLOAD_PATH = 'public/images';
 
// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);
 
function safeFilename(name) {
name = name.replace(/ /g, '-');
name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
name = name.replace(/\.+/g, '.');
name = name.replace(/-+/g, '-');
name = name.replace(/_+/g, '_');
return name;
}

function fileMinusExt(fileName) {
return fileName.split('.').slice(0, -1).join('.');
}
 
function fileExtension(fileName) {
return fileName.split('.').slice(-1);
}
 
// Where you would do your processing, etc
function processImage(id, name, path, cb) {
console.log('Processing image');
gm(path).resize(null,200).write(path, function(err) {
    if(err) console.log("Image resizing error... bummer");                                
});
cb(null, {
'result': 'success',
'id': id,
'name': name,
'path': path
});
}
 
 
module.exports = {
upload: function (req, res) {

    var userId = req.body['userId'];
    if (!userId) return res.send("No id specified.", 500);
    
    //Deleting current image if it exists
    User.findOne(userId).done(function(err,user) {
        if (err) console.log("Couldn't find user");
        if (user.photoPath) {
            fs.unlink(user.photoPath, function(err) { 
                if(err) console.log("Couldn't delete: " + user.photoPath); 
            });
        }
    });
    
var file = req.files.userPhoto,
id = sid.generate(),
fileName = id + "." + fileExtension(safeFilename(file.name)),
dirPath = UPLOAD_PATH + '/' + new Date().toISOString().substr(0,10),
filePath = dirPath + '/' + fileName;
 
try {
mkdirp.sync(dirPath, 0755);
} catch (e) {
console.log(e);
}
 
fs.readFile(file.path, function (err, data) {
if (err) {
res.json({'error': 'could not read file'});
} else {
fs.writeFile(filePath, data, function (err) {
    console.log('Writing file to ' + filePath);
if (err) {
res.json({'error': 'could not write file to storage'});
} else {
processImage(id, fileName, filePath, function (err, data) {
if (err) {
res.json(err);
} else {
    
    // Link to users profile
    User.update(userId, {id:userId, photoPath:filePath}, function userUpdated(err, updatedUser) {  
     if (err) {
        console.log('err error');
      }
      if(!updatedUser) {
        console.log('updated user error');
      }
    });
    
    return res.redirect('/user/'+userId);
//res.json(data);
}
});
}
})
}
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