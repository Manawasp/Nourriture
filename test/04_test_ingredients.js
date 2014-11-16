var request = require('superagent'),
  expect = require('expect.js');
  
describe('Ingredients Controller', function(){
  var user1_token = "";
  var user1_id = undefined;
  var user2_token = "";
  var user2_id = undefined;
  var ingredient1_id = "";
  var ingredient2_id = "";

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
        done()
      });
    });
  })

  describe('CREATE Ingredient', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/ingredients')
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
      .post('localhost:8080/ingredients')
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

    it ("400: name is undefined", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("name is undefined");
        done()
      });
    });

    it ("400: name contain at least 2 charactersd", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"name":"a"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("name contain at least 2 characters");
        done()
      });
    });

    it ("200: create chocolate Ingredient", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"name":"chocolat"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("chocolat");
        ingredient1_id = res.body.id
        done()
      });
    });

    it ("200: create sugar Ingredient", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"name":"sugar"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("sugar");
        done()
      });
    });

    it ("200: create pork Ingredient, musulman can't eat this", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"name":"pork", "blacklist": ["musulman"]}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("pork");
        ingredient2_id = res.body.id
        expect(res.body.blacklist[0]).to.equal("musulman");
        done()
      });
    });

    it ("200: ingredient is uniq", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"name":"pork", "blacklist": ["musulman"]}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("this ingredient already exist");
        done()
      });
    });
  })

  describe('UPDATE Ingredient', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .patch('localhost:8080/ingredients/'+ ingredient1_id)
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
      .patch('localhost:8080/ingredients/' + ingredient1_id)
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
      .patch('localhost:8080/ingredients/diowjoidw')
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

    it ("200: update chocolat -> choco", function(done){
     request
      .patch('localhost:8080/ingredients/' + ingredient1_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"name": "choco"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("choco");
        done()
      });
    });
  });

  describe('GET Ingredient', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/ingredients/'+ ingredient1_id)
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
      .get('localhost:8080/ingredients/fokjwpo')
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

    it ("200: resource not found", function(done){
     request
      .get('localhost:8080/ingredients/' + ingredient1_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("choco");
        done()
      });
    });

  });

  describe('DELETE Ingredient', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/ingredients/'+ ingredient1_id)
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
      .del('localhost:8080/ingredients/' + ingredient1_id)
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
      .del('localhost:8080/ingredients/fokjwpo')
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

    it ("200: delete choco", function(done){
     request
      .del('localhost:8080/ingredients/' + ingredient1_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("ingredient removed");
        done()
      });
    });

  });

  describe('SEARCH Ingredient', function(){
    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/ingredients/search')
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
      .post('localhost:8080/ingredients/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.ingredients).to.exist;
        expect(res.body.ingredients.length).to.equal(2);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(2);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search with pattern", function(done){
     request
      .post('localhost:8080/ingredients/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"name":"ug"}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.ingredients).to.exist;
        expect(res.body.ingredients.length).to.equal(1);
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
      .post('localhost:8080/ingredients/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"offset":1}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.ingredients).to.exist;
        expect(res.body.ingredients.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(1);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern + limit", function(done){
     request
      .post('localhost:8080/ingredients/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"limit":1}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.ingredients).to.exist;
        expect(res.body.ingredients.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.equal(1);
        done()
      });
    });

    it ("200: search without pattern but with blacklist 'musulman'", function(done){
     request
      .post('localhost:8080/ingredients/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"blacklist":["musulman"]}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.ingredients).to.exist;
        expect(res.body.ingredients.length).to.equal(1);
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