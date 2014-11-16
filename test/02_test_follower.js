var request = require('superagent'),
  expect = require('expect.js');
  
describe('Follower Controller', function(){
  var user1_token = "";
  var user1_id = undefined;
  var user2_token = "";
  var user2_id = undefined;

  before(function(done){
   request
    .post('localhost:8080/sessions')
    .send('{"email": "manawasp@gmail.com", "password": "Manawasp59"}')
    .set('Content-Type', 'application/json')
    .end(function(res)
    {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.token).to.exist;
      expect(res.body.user).to.exist;
      expect(res.body.user.id).to.exist;
      user1_id = res.body.user.id;
      user1_token = res.body.token
      request
        .post('localhost:8080/sessions')
        .send('{"email": "manawasp2@gmail.com", "password": "Manawasp59"}')
        .set('Content-Type', 'application/json')
        .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.token).to.exist;
        expect(res.body.user).to.exist;
        expect(res.body.user.id).to.exist;
        user2_id = res.body.user.id;
        user2_token = res.body.token
        done()
      });
    });
  })

  describe('CREATE follower', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/followers')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ('400: bad request - user_id empty', function(done){
     request
      .post('localhost:8080/followers/')
      .send('{}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('bad request');
        done()
      });
    });

    it ("404: user doesn't exist", function(done){
     request
      .post('localhost:8080/followers/')
      .send('{"user_id": "dokwpdokwokw"}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('resource not found');
        done()
      });
    });

    it ("200: build follow relation", function(done){
     request
      .post('localhost:8080/followers/')
      .send('{"user_id": "' + user2_id + '"}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });

    it ("400: relation already exist", function(done){
     request
      .post('localhost:8080/followers/')
      .send('{"user_id": "' + user2_id + '"}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.exist
        expect(res.body.error).to.equal("already in your followers")
        done()
      });
    });
  });

    // it ("400: you can't follow yourself", function(done){
    //  request
    //   .post('localhost:8080/followers/')
    //   .send('{"user_id": "' + user1_id + '"}')
    //   .set('Content-Type', 'application/json')
    //   .set('Auth-Token', user1_token)
    //   .end(function(res)
    //   {
    //     console.log(res.body)
    //     expect(res).to.exist;
    //     expect(res.status).to.equal(404);
    //     expect(res.body.error).to.exist
    //     expect(res.body.error).to.equal("resource not found")
    //     done()
    //   });
    // });

  describe('RETRIEVE follower', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/followers/uwidhwuihdw')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("404: user not found", function(done){
     request
      .get('localhost:8080/followers/ojwdoiwj')
      .send('{}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.exist
        expect(res.body.error).to.equal("resource not found")
        done()
      });
    });

    it ("200: retrieve followers data", function(done){
     request
      .get('localhost:8080/followers/' + user1_id)
      .send('{}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body[0].pseudo).to.exist
        expect(res.body[0].pseudo).to.equal('manawasp2')
        done()
      });
    });
  });

  describe('DELETE follower', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/followers/uwidhwuihdw')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("404: user not found", function(done){
     request
      .del('localhost:8080/followers/ojwdoiwj')
      .send('{}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.exist
        expect(res.body.error).to.equal("resource not found")
        done()
      });
    });

    it ("200: user is removed", function(done){
     request
      .del('localhost:8080/followers/'+ user2_id)
      .send('{}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.exist
        expect(res.body.success).to.equal("user is removed to your follower")
        done()
      });
    });

    it ("400: your not followed by him", function(done){
     request
      .del('localhost:8080/followers/'+ user2_id)
      .send('{}')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.exist
        expect(res.body.error).to.equal("isn't in your followers")
        done()
      });
    });
  })
});