var request = require('superagent'),
  expect = require('expect.js');

describe('RecipesFavorites Controller', function(){
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

  describe('CREATE Recipesfavorites', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/favorites/recipes/' + recipe_id)
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
      .post('localhost:8080/favorites/recipes/dowkpodwkpokwd')
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

    it ("200: favorites with success", function(done){
     request
      .post('localhost:8080/favorites/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("you favorites the recipe");
        done()
      });
    });

    it ("400: already favorites", function(done){
     request
      .post('localhost:8080/favorites/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("you already favorites this recipe");
        done()
      });
    });

  });

  describe('SEARCH Recipesfavorites', function(){
    it ("200: search without limit", function(done){
     request
      .post('localhost:8080/favorites/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.equal(0);
        done()
      });
    });

    it ("200: search without limit", function(done){
     request
      .post('localhost:8080/favorites/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"offset":2}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.equal(2);
        done()
      });
    });
  });

  describe('DELETE Recipesfavorites', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/favorites/recipes/' + recipe_id)
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
      .del('localhost:8080/favorites/recipes/dowkpodwkpokwd')
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

    it ("200: unfavorites with success", function(done){
     request
      .del('localhost:8080/favorites/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("you unfavorites the recipe");
        done()
      });
    });

    it ("400: already favorites", function(done){
     request
      .del('localhost:8080/favorites/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("you don't favorites this recipe");
        done()
      });
    });

  });

    describe('SEARCH Recipesfavorites', function(){
      it ("200: search without limit", function(done){
       request
        .post('localhost:8080/favorites/search')
        .set('Content-Type', 'application/json')
        .set('Auth-Token', users[1].token)
        .send('{}')
        .end(function(res)
        {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body.size).to.equal(0);
          expect(res.body.offset).to.equal(0);
          done()
        });
      });
    });
});
