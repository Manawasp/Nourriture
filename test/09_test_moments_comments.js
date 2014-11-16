var request = require('superagent'),
  expect = require('expect.js');
  
describe('RecipesComments Controller', function(){
  var user1_token = "";
  var user1_id = undefined;
  var user2_token = "";
  var user2_id = undefined;
  var moment_id = "";
  var comment_id = "";

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
        .send('{"email": "superadmin@gmail.com", "password": "Superadmin59"}')
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
        request
          .post('localhost:8080/moments/search')
          .set('Content-Type', 'application/json')
          .set('Auth-Token', user2_token)
          .send('{}')
          .end(function(res)
        {
          expect(res.status).to.equal(200);
          expect(res.body.moments).to.exist;
          expect(res.body.moments.length).to.equal(1);
          moment_id = res.body.moments[0].id;
          expect(res.body.size).to.exist;
          expect(res.body.size).to.equal(1);
          expect(res.body.offset).to.exist;
          expect(res.body.offset).to.equal(0);
          expect(res.body.limit).to.exist;
          done()
        });
      });
    });
  });

  describe('CREATE MomentsComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/comments/moments/' + moment_id)
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

    it ("400: empty comment", function(done){
     request
      .post('localhost:8080/comments/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("comment is empty");
        done()
      });
    });

    it ("400: comment length's is too small", function(done){
     request
      .post('localhost:8080/comments/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"comment": "21"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("comment contain at least 3 characters");
        done()
      });
    });

    it ("200: user post comment in recipe", function(done){
     request
      .post('localhost:8080/comments/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"comment": "HelloMoment"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.id).to.be.an('string');
        expect(res.body.created_by).to.be.an('string');
        comment_id = res.body.id;
        done()
      });
    });

  });

  describe('GET MomentsComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/comments/moments/' + moment_id + '/wijowidj')
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

    it ("404: resource not found", function(done){
     request
      .get('localhost:8080/comments/moments/' + moment_id + '/wijowidj')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200: update comment", function(done){
     request
      .get('localhost:8080/comments/moments/' + moment_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });

  })

  describe('UPDATE MomentsComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .patch('localhost:8080/comments/moments/' + moment_id + '/' + comment_id)
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

    it ("403: not the creator", function(done){
     request
      .patch('localhost:8080/comments/moments/' + moment_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .patch('localhost:8080/comments/moments/' + moment_id + '/wijowidj')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200: update comment", function(done){
     request
      .patch('localhost:8080/comments/moments/' + moment_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"comment": "super plus long"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.comment).to.equal("super plus long");
        done()
      });
    });

  })

  describe('DELETE MomentsComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/comments/moments/' + moment_id + '/' + comment_id)
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

    it ("403: not the creator", function(done){
     request
      .del('localhost:8080/comments/moments/' + moment_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .del('localhost:8080/comments/moments/' + moment_id + '/wijowidj')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200: delete comment", function(done){
     request
      .del('localhost:8080/comments/moments/' + moment_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("comment removed");
        done()
      });
    });

  })

  describe('SEARCH MomentsComments', function(){

    it ("200: user post comment in recipe", function(done){
     request
      .post('localhost:8080/comments/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"comment": "Hello"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.id).to.be.an('string');
        expect(res.body.created_by).to.be.an('string');
        comment_id = res.body.id;
        done()
      });
    });

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/comments/moments/' + moment_id + '/search')
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

    it ("200: search with unvalid moments", function(done){
     request
      .post('localhost:8080/comments/moments/okdwopkwpdok/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.comments).to.exist;
        expect(res.body.comments.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search with valid moments", function(done){
     request
      .post('localhost:8080/comments/moments/' + moment_id + '/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.comments).to.exist;
        expect(res.body.comments.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });
  })
})