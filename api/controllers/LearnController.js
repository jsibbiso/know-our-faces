/**
 * LearnController
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

module.exports = {
    
  
    //TODO: Check the actual user (id) exists in the database
   index: function (req, res) {
        var id = req.param('id');
        if (!id) return res.send("No id specified.", 500);
       
    
        MemoryItem.findOne({reviewerId:id}).where({nextReviewDate:{'<' : new Date()}}).sort("nextReviewDate ASC").done(function(err, mem) {
         if(mem) {
           User.findOne({id:mem.reviewedId}).done(function userFound(err, user) {
                    return res.view({
                        user: user,
                        reviewerId:id
                    });
               });    
         }
         else
         {
            User.findOne({id:id}).done(function userFound(err,user) {
             if (err) {
                 console.log('user not found');
                 return res.send("User not found " + id, 500);
             }
             
             queryStr = "SELECT id FROM user where id not in (select reviewedid from memoryitem where memoryitem.reviewerId = " + id + ") and user.name != '' and user.photoPath is not null and id != " + id;
             locationBasedStr = " and workLocationId in (SELECT location.id FROM `location` inner join user on user.learnLocationId = location.id or user.learnLocationId = location.parentId where user.id = " + id + ");";
             if(user.learnLocationId) { 
                 queryStr = queryStr + locationBasedStr;
             } else {
                 queryStr = queryStr + ';';
             }
             //Look for new users to review
             MemoryItem.query(queryStr, function(err,items) {
                 
               if (err) {
                    console.log('special query error');
                }
            
               if(items.length > 0) {
                   User.find({id:items[0]['id']}).done(function userFound(err, user) {
                        return res.view({
                            user: user[0],
                            reviewerId:id
                        });
                   }); 
                
               } else {             
                    return res.view({reviewerId:id, done: true});
               }
               
            });
           });
         }
       });    
  },
    
  recordRecall: function(req, res) {
      var params = _.extend(req.query || {}, req.params || {}, req.body || {});
      
      MemoryItem.findOne(
          {reviewerId:params["reviewerId"], 
           reviewedId:params["reviewedId"]})
        .done(function(err, mem) {
            if(mem) {
                //Update
                switch(params['recall']) {
                    case '0':
                        mem.recalledWrong();
                        break;
                    case '1':
                        mem.recalledHard();
                        break;
                    case '2':
                        mem.recalledEasy();
                        break;
                }
                mem.save(function(err) { if (err) {console.log(err); return res.json(err,500); }});
                return res.json("Success",200);
                
            } else {
                
                //Create new entry - As it's the first review, review again as soon as the rest of the due reviews have been completed
                var nextReview = new Date(new Date().getTime() + (0.25 + Math.pow(params['recall'],9)*5)*60000); 
                MemoryItem.create(
                    {reviewerId:params["reviewerId"], 
                    reviewedId:params["reviewedId"],
                    nextInterval:"1.0",
                    nextReviewDate:nextReview}, 
                        function itemCreated (err, item) {
                            console.log(err);
                            if (err) return res.json(err,500);
                            return res.json("Success",200);
                        });
                };
            });
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LearnController)
   */
  _config: {}

  
};
