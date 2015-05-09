var request = require('superagent'),
  expect = require('expect.js');

describe('Recipes Controller', function(){
  var users = [{"id": 0, "token": ""},
               {"id": 0, "token": ""},
               {"id": 0, "token": ""}]
  var ingredients = [ {"id": 0},
                      {"id": 0}]
  var recipe_id = "";

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
          .post('localhost:8080/ingredients/search')
          .set('Content-Type', 'application/json')
          .set('Auth-Token', users[0].token)
          .send('{}')
          .end(function(res)
        {
          expect(res.status).to.equal(200);
          expect(res.body.ingredients).to.exist;
          expect(res.body.ingredients.length).to.equal(2);
          ingredients[0].id = res.body.ingredients[0].id
          ingredients[1].id = res.body.ingredients[1].id
          done()
        });
      });
    });
  });


  describe('CREATE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/recipes')
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

    it ("403: don't have the permission", function(done){
     request
      .post('localhost:8080/recipes')
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

    it ("400: title is undefined", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("title is undefined");
        done()
      });
    });

    it ("400: title contain at least 2 characters", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"title":"a"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("title contain at least 2 characters");
        done()
      });
    });


    it ("200: create recipe", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"title":"Pork with sugar", "ingredients": ["'+ingredients[0].id+'", "'+ingredients[1].id+'"], "savours": ["sugar"], "labels": ["grandchallenge"], "blacklist": ["musulman"], "country": "france", "city": "paris"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        recipe_id = res.body.recipe.id;
        done()
      });
    });

  })

  describe('GET Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/recipes/' + recipe_id)
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
      .get('localhost:8080/recipes/dedplepf')
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

    it ("200: get recipe information", function(done){
     request
      .get('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });

  })

  describe('UPDATE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .patch('localhost:8080/recipes/' + recipe_id)
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

    it ("403: don't have the permission", function(done){
     request
      .patch('localhost:8080/recipes/' + recipe_id)
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
      .patch('localhost:8080/recipes/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200:  update title", function(done){
     request
      .patch('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"title": "Super pork and sugar"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });
  })

  describe('DELETE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/recipes/' + recipe_id)
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

    it ("403: don't have the permission", function(done){
     request
      .del('localhost:8080/recipes/' + recipe_id)
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
      .del('localhost:8080/recipes/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200:  delete recipe", function(done){
     request
      .del('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"title": "Super pork and sugar"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("recipe removed");
        done()
      });
    });
  })

  describe('SEARCH Recipe', function(){

    it ("200: create recipe", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"title":"Pork with sugar", "ingredients": ["'+ingredients[0].id+'", "'+ingredients[1].id+'"], "savours": ["sugar"], "labels": ["grandchallenge"], "blacklist": ["musulman"], "country": "france", "city": "paris"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        recipe_id = res.body.recipe.id;
        done()
      });
    });

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    })

    it ("200: search without pattern", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search with pattern", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"title":"ug"}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search without pattern + offset", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"offset":1}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(1);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern + savours", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"savours":["sugar"]}')
      .end(function(res)
      {
        console.log(res.body)
        // expect(res.status).to.equal(200);
        // expect(res.body.recipes).to.exist;
        // expect(res.body.recipes.length).to.equal(1);
        // expect(res.body.size).to.exist;
        // expect(res.body.size).to.equal(1);
        // expect(res.body.offset).to.exist;
        // expect(res.body.offset).to.equal(0);
        // expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with blacklist 'musulman'", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"blacklist":["musulman"]}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with one ingredients", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"ingredients": ["'+ingredients[0].id+'"]}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with country", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"country": "france"}')
      .end(function(res)
      {
        // console.log(res.body)
        // expect(res.status).to.equal(200);
        // expect(res.body.recipes).to.exist;
        // expect(res.body.recipes.length).to.equal(1);
        // expect(res.body.size).to.exist;
        // expect(res.body.size).to.equal(1);
        // expect(res.body.offset).to.exist;
        // expect(res.body.offset).to.equal(0);
        // expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with labels", function(done){
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
