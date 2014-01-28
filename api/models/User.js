/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	email: {
      type: 'email', // Email type will get validated by the ORM
      required: true,
      contains: "thoughtworks"
    },
    name: {
      type: 'string'
    },
    photoPath: {
      type: 'string'
    },
    photoId: {
      type: 'string'
    },
    workLocationId: {
        type: 'INT'
    },
    learnLocationId: {
        type: 'INT'
    }
      
  }

};
