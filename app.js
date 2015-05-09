/**
 * Name         : Food Nourriture
 * Description  : Build Food application for Jiaotong University IT department
 * Authors      : Clovis Kyndt (https://github.com/Manawasp)
 * Doc          : http://docs.foodapicn.apiary.io/
 * Source       : https ://github.com/ftb59/Nourriture
 * Date         : 14/10/14 to xx/xx/xx
 */

/**
 * load librairie
 */

var express     = require('express')
  , db          = require('./db')
  , bodyParser  = require('body-parser')
  , cors        = require('cors')
  , path 		    = require('path')
  , fs          = require('fs');

/**
 * global var
 */

var app         = express()
  , port        = process.env.PORT || 8080;

/**
 * init parser json
 */

app.use(bodyParser.urlencoded({ extended: true, limit: '8mb' }));
app.use(bodyParser.json({limit: '8mb'}));
console.log(path.join(__dirname, 'public'))
app.use("/pictures", express.static(path.join(__dirname, 'public/pictures')));
app.use(cors());

/**
 * Initialization
 */

app.use(require('./controllers'));

/**
 * Init dir if not exist
 */


var buildDirPicture = function(path) {
  if (!fs.existsSync(__dirname + path)) {
    fs.mkdirSync(__dirname + path, 0755, function(err){
      if(err){console.log("Error:" + err);} })
    console.log("CREATED :: dir `"+path+"`")
  }
}

buildDirPicture('/public/pictures')
buildDirPicture('/public/pictures/avatars')
buildDirPicture('/public/pictures/ingredients')
buildDirPicture('/public/pictures/recipes')

/**
  * Start server
  */

app.listen(port);
console.log('Express server listening on port ' + port);
