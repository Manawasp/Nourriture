var request = require('superagent'),
  expect = require('expect.js');
  
describe('RecipesLikes Controller', function(){
  var user1_token = "";
  var user1_id = undefined;
  var user2_token = "";
  var user2_id = undefined;
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
          .post('localhost:8080/recipes/search')
          .set('Content-Type', 'application/json')
          .set('Auth-Token', user1_token)
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

  describe('CREATE RecipesLikes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/like/recipes/' + recipe_id)
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
      .post('localhost:8080/like/recipes/dowkpodwkpokwd')
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

    it ("200: like with success", function(done){
     request
      .post('localhost:8080/like/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("you like the recipe");
        done()
      });
    });

    it ("400: already like", function(done){
     request
      .post('localhost:8080/like/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("you already like this recipe");
        done()
      });
    });

  });

  describe('DELETE RecipesLikes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/like/recipes/' + recipe_id)
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
      .del('localhost:8080/like/recipes/dowkpodwkpokwd')
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

    it ("200: unlike with success", function(done){
     request
      .del('localhost:8080/like/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("you unlike the recipe");
        done()
      });
    });

    it ("400: already like", function(done){
     request
      .del('localhost:8080/like/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("you don't like this recipe");
        done()
      });
    });

  });

});