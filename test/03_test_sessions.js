var request = require('superagent'),
  expect = require('expect.js');
  
describe('Session Controller', function(){
  var user1_token = "";
  var user1_id = undefined;
  var user2_token = "";
  var user2_id = undefined;

  describe('CREATE sessions', function(){

    it ("400: password empty", function(done){
     request
      .post('localhost:8080/sessions')
      .set('Content-Type', 'application/json')
      .send('{"email": "manawasp2@gmail.com"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("bad request");
        done()
      });
    });

    it ("400: email empty", function(done){
     request
      .post('localhost:8080/sessions')
      .set('Content-Type', 'application/json')
      .send('{"password": "Manawasp59"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("bad request");
        done()
      });
    });

    it ("404: invalid user", function(done){
     request
      .post('localhost:8080/sessions')
      .set('Content-Type', 'application/json')
      .send('{"email":"dwldeokpo@gmail.com","password": "Manawasp59"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("400: bad connection", function(done){
     request
      .post('localhost:8080/sessions')
      .set('Content-Type', 'application/json')
      .send('{"email":"manawasp2@gmail.com","password": "Manawasp9"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("match email/password failed");
        done()
      });
    });

    it ("200: connect user", function(done){
     request
      .post('localhost:8080/sessions')
      .set('Content-Type', 'application/json')
      .send('{"email":"manawasp2@gmail.com","password": "Manawasp59"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.token).to.exist;
        done()
      });
    });

  });
});