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
       console.log("index");
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
             //Look for new users to review
             MemoryItem.query("SELECT id FROM user where id not in (select reviewedid from memoryitem where memoryitem.reviewerId = " + id + ") and user.name != '' and user.photoPath is not null;", function(err,items) {
                 
               if (err) {
                    console.log('err error');
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
         }
       });    
  },
    
  recordRecall: function(req, res) {
      console.log("recordRecall");
      var params = _.extend(req.query || {}, req.params || {}, req.body || {});
      console.log(params);
      
      MemoryItem.findOne(
          {reviewerId:params["reviewerId"], 
           reviewedId:params["reviewedId"]})
        .done(function(err, mem) {
            console.log(mem);
            if(mem) {
                console.log("Update");
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
                
                console.log("Create");
                //Create new entry - As it's the first review, review again as soon as the rest of the due reviews have been completed
                var nextReview = new Date(new Date().getTime() + (0.25 + params['recall'])*60000); 
                MemoryItem.create(
                    {reviewerId:params["reviewerId"], 
                    reviewedId:params["reviewedId"],
                    nextInterval:"1.0",
                    nextReviewDate:nextReview}, 
                        function itemCreated (err, item) {
                            console.log("Done!");
                            console.log(err);
                            console.log(item);
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
