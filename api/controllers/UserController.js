/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var UserController = {
    'new': function (req, res) {
        req.session.sesUserId = null; 
        return res.view();
    },
    
    show: function (req, res) {
        var id = req.param('id');
        if (!id) return res.send("No id specified.", 500);
        req.session.sesUserId = id;
        
        User.find(id, function userFound(err, user) {
            utility.locationsList(function(locations) {
                return res.view({
                    user:user[0],
                    locations:locations
                })
            });        
        });
    },
    
    update: function (req, res) {

        var params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var id = params.id;
        if (!id) return res.send("No id specified.", 500);
        
        if(params['name']) { params['name'] = utility.toTitleCase(params['name']); }
        if(params['workLocationId'] == '') { params['workLocationId'] = null; }
        if(params['learnLocationId'] == '') { params['learnLocationId'] = null; }
        User.update(id, params, function userUpdated(err, updatedUser) {
            if (err) {
                console.log('err error: ' + err);
            }
            if(!updatedUser) {
                console.log('updated user error');
            }
            res.redirect('/user/'+id);   
        });
    },
    
    create: function (req, res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {});
        
        //Check user is not just logging in
        User.findOne({email:params['email']}).done(function userFound(err, user) {
            if(user)
            {
                if (err) return res.send(err,500);
                req.session.sesUserId = user.id;
                res.redirect('/user/'+ user.id);
            }
            else
            {        
                User.create(params, function userCreated (err, createdUser) {
                    if (err) return res.send(err,500);
                    req.session.sesUserId = createdUser.id;
                    res.redirect('/user/'+ createdUser.id);
                });
            }
        });
    },
        
    photo: function (req, res) {
        var id = req.param('id');
        if (!id) return res.send("No id specified.", 500);

        User.findOne({id:id}, function userFound(err, user) {
            if (err) return res.send(err,500);
            return res.view({
                user:user
            });
        });
    },
    
    rotatePhoto: function(req,res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var id = req.param('id');
        if (!id) return res.send("No id specified.", 500);

        User.findOne({id:id}).done(function userFound(err, user) {
            if (err) return res.send(err,500);
            
            user.rotatePhoto(params['direction']);
            user.save(function(err) {
                if (err) { console.log(err); return res.send(err,500); }
                
                return res.redirect('/user/'+id+'/photo');
            });
            
        });
    },
    
    index: function(req,res) {
        return res.send("Restricted", 500);
    }
}

module.exports = UserController;
