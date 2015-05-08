var request = require('superagent'),
  expect = require('expect.js');

describe('RecipesComments Controller', function(){
  var users = [{"id": 0, "token": ""},
               {"id": 0, "token": ""},
               {"id": 0, "token": ""}]
  var recipe_id = "";
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
      users[0].id = res.body.user.id;
      users[0].token = res.body.token
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
        users[1].id = res.body.user.id;
        users[1].token = res.body.token
        request
          .post('localhost:8080/recipes/search')
          .set('Content-Type', 'application/json')
          .set('Auth-Token', users[0].token)
          .send('{"labels": ["grandchallenge"]}')
          .end(function(res)
        {
          expect(res.status).to.equal(200);
          expect(res.body.recipes).to.exist;
          expect(res.body.recipes.length).to.equal(1);
          recipe_id = res.body.recipes[0].id;
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

  describe('CREATE RecipesComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/comments/recipes/' + recipe_id)
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
      .post('localhost:8080/comments/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
      .post('localhost:8080/comments/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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
      .post('localhost:8080/comments/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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

  });

  describe('GET RecipesComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/comments/recipes/' + recipe_id + '/wijowidj')
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
      .get('localhost:8080/comments/recipes/' + recipe_id + '/wijowidj')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
      .get('localhost:8080/comments/recipes/' + recipe_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"comment": "super plus long"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });

  })

  describe('UPDATE RecipesComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .patch('localhost:8080/comments/recipes/' + recipe_id + '/' + comment_id)
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
      .patch('localhost:8080/comments/recipes/' + recipe_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
      .patch('localhost:8080/comments/recipes/' + recipe_id + '/wijowidj')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
      .patch('localhost:8080/comments/recipes/' + recipe_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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

  describe('DELETE RecipesComments', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/comments/recipes/' + recipe_id + '/' + comment_id)
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
      .del('localhost:8080/comments/recipes/' + recipe_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
      .del('localhost:8080/comments/recipes/' + recipe_id + '/wijowidj')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
      .del('localhost:8080/comments/recipes/' + recipe_id + '/' + comment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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

  describe('SEARCH RecipesComments', function(){

    it ("200: user post comment in recipe", function(done){
     request
      .post('localhost:8080/comments/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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
      .post('localhost:8080/comments/recipes/' + recipe_id + '/search')
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

    it ("200: search with unvalid recipes", function(done){
     request
      .post('localhost:8080/comments/recipes/okdwopkwpdok/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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

    it ("200: search with valid recipes", function(done){
     request
      .post('localhost:8080/comments/recipes/' + recipe_id + '/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
