/**
 * MemoryItem
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    
    reviewerId	: 'INT',

    reviewedId	: 'INT',

    //Interval is in days  
    nextInterval	: 'FLOAT',

    nextReviewDate	: 'DATETIME',
      
    recalledWrong: function() {
        this.nextReviewDate = new Date(new Date().getTime() + 0.25*60000);
        this.nextInterval = 1.0;
    },
    recalledHard: function() {
        this.nextReviewDate = new Date(new Date().getTime() + this.nextInterval/2*86400000);
        this.nextInterval = this.nextInterval * 1.25;
    },
    recalledEasy: function() {
        this.nextReviewDate = new Date(new Date().getTime() + this.nextInterval*86400000);
        this.nextInterval = this.nextInterval * 2;
    }

  }

};
