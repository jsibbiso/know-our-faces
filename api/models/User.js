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
    photoRotation: {
        type: 'INTEGER',
        defaultsTo: 0
    },
    workLocationId: {
        type: 'INTEGER'
    },
    learnLocationId: {
        type: 'int'
    },
    rotatedPhotoPath: function() {
        if(Number(this.photoRotation) > 0) {
            var splitPath = this.photoPath.split('upload/');
            var newPath = splitPath[0] + 'upload/a_' + this.photoRotation + '/c_scale,h_200/' + splitPath[1];
            return(newPath);
        } else {
            return(this.photoPath);
        }
    },
    rotatePhoto: function(direction) {
        var movement = 0;
        switch(direction) {
            case 'left':
                movement = -90;
                break;
            case 'right':
                movement = 90;
                break;
            default:
                movement = 0;
                break;
        }
        this.photoRotation = Number(this.photoRotation) + movement;
        if(this.photoRotation < 0) { this.photoRotation = this.photoRotation + 360; }
        if(this.photoRotation >= 360) { this.photoRotation = this.photoRotation - 360; }
    }
      
  }

};
