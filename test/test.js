var request = request('supertest');
var app = require('../app.js');

describ('GET /',function(){
	it('response with Hello world',function(done){
		request(app).get('/').expect('hello world',done);
	});
});