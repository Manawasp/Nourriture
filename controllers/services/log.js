
/**
 * Static var
 */

var	bunyan      = require('bunyan')
	, log         = bunyan.createLogger({
										name: "foodapi",
										streams: [{
											path: 'logs/api.log'
										}]
									});

exports.writeLog = function(req, resource, status, resBody) {
	log.info(	{"method": 		req.method,
						"ressource": 	resource,
						"status":			status,
						"req": {
							"path": req.path,
							"body": req.body
						},
						"res": {
							"body": resBody
						}
					})
}
