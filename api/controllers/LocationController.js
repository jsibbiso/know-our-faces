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
      'new': function (req, res) {
        return res.view();
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
                Location.create(params, function locationCreated(err, location) {
                    if (err) return res.send(err,500);
                    res.redirect('/location/'+ location.id);
                });
            }
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LocationController)
   */
  _config: {}

  
};