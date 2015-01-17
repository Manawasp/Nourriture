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
  , path 		= require('path');

/**
 * global var
 */

var app         = express()
  , port        = process.env.PORT || 8080;

/**
 * init parser json
 */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log(path.join(__dirname, 'public'))
app.use("/pictures", express.static(path.join(__dirname, 'public/pictures')));
app.use(cors());

/**
 * Initialization
 */

app.use(require('./controllers'));

/**
  * Start server
  */

app.listen(port);
console.log('Express server listening on port ' + port);
