/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

if(process.env.VCAP_SERVICES) {
    var af_mysql = JSON.parse(process.env.VCAP_SERVICES)["mysql-5.1"][0]["credentials"];
    var af_mysql_host = af_mysql["hostname"];
    var af_mysql_database = af_mysql["name"];
    var af_mysql_port = af_mysql["port"];
    var af_mysql_user = af_mysql["user"];
    var af_mysql_password = af_mysql["password"];
}

if(process.env.CLOUDY_NAME) {
    var cloudinary = require('cloudinary');
    
    cloudinary.config({ 
        cloud_name: process.env.CLOUDY_NAME, 
        api_key: process.env.CLOUDY_API_KEY, 
        api_secret: process.env.CLOUDY_API_SECRET
      });
}

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'myLocalMySQLDatabase',

  // Persistent adapter for DEVELOPMENT ONLY
  // (data is preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // MySQL is the world's most popular relational database.
  // Learn more: http://en.wikipedia.org/wiki/MySQL
  myLocalMySQLDatabase: {
    module: 'sails-mysql',
    host: af_mysql_host || 'localhost',
    user: af_mysql_user || 'user',
    // Psst.. You can put your password in config/local.js instead
    // so you don't inadvertently push it up if you're using version control
    password: af_mysql_password || 'db', 
    database: af_mysql_database || 'db',
    port: af_mysql_port || 3306
  }
};