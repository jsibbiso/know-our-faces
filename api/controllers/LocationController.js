/**
 * LocationController
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

var utility = require('../services/utility');

module.exports = {
    index: function (req, res) {
        
        var locs = {}; // {detail : loc, leaves : [locs]} 
        Location.find().sort('name').exec(function(err,locations) {
            for(l=0;l<locations.length;l++) {
                if(locations[l]['parentId']) {
                    if(!(locations[l]['parentId'] in locs)) {
                        //Create new branch
                        locs[locations[l]['parentId']] = {'detail':null,'leaves':[]};
                    }         
                    //Add as leaf
                    locs[locations[l]['parentId']]['leaves'].push(locations[l]);
                } else if(locations[l]['id'] in locs) {
                    //Add as detail to branch
                    locs[locations[l]['id']]['detail'] = locations[l];
                } else {
                    //Add as branch
                    locs[locations[l]['id']] = {'detail':locations[l],'leaves':[]};
                }
            };
            return res.view({locations: locs});
        });          
    },  
    
    'new': function (req, res) {
        utility.locationsList(function(locations) {
            return res.view({parents: locations});
        });
    },
  
    create: function (req, res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var locationName = utility.toTitleCase(params['name']);
        params['name'] = locationName;
        
        //Check location does not already exist - do some name smarts (Ie. lowercase)
        Location.findOne({name:locationName}).done(function locationFound(err, location) {
            if(location)
            {
                if (err) return res.send(err,500);
                res.redirect('/location/'+ location.id);
            }
            else
            {        
                if(params['parentId'] == '') { 
                    params['parentId'] = null; 
                } else {
                    params['parentId'] = Number(params['parentId']); 
                }
                console.log(params);
                Location.create(params, function locationCreated(err, location) {
                    if (err) return res.send(err,500);
                    res.redirect('/location/'+ location.id);
                });
            }
        });
    },
    
    update: function (req, res) {

        var params = _.extend(req.query || {}, req.params || {}, req.body || {});
        var id = params.id;
        if (!id) return res.send("No id specified.", 500);
        params['name'] = utility.toTitleCase(params['name']);
        
        if(params['parentId'] == '') { 
            params['parentId'] = null; 
         }  else {
            params['parentId'] = Number(params['parentId']); 
         }
        Location.update(id, params, function locationUpdated(err, updatedLocation) {
            if (err) {
                console.log('err error: ' + err);
            }
            if(!updatedLocation) {
                console.log('updated location error');
            }
            res.redirect('/location/'+id);   
        });
    },
    
    show: function (req, res) {
        var id = req.param('id');
        if (!id) return res.send("No id specified.", 500);
        
        Location.findOne({id:id}).done(function locationFound(err, location) {
            if (err) return res.send(err,500);
            
            utility.locationsList(function(locations) {
                return res.view({parents: locations, location:location});
            });
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LocationController)
   */
  _config: {}

  
};