var request = require('superagent')
  , expect  = require('expect.js')
  , fs      = require('fs');

describe('Ingredients Controller', function(){
  var users = [{"id": 0, "token": ""},
               {"id": 0, "token": ""},
               {"id": 0, "token": ""}]
  var ingredients = [ {"id": 0},
                      {"id": 0}]

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

    it ("400: name is undefined", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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
      .set('Auth-Token', users[1].token)
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
      .set('Auth-Token', users[1].token)
      .send('{"name":"chocolat"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("chocolat");
        ingredients[0].id = res.body.id
        done()
      });
    });

    it ("200: create sugar Ingredient", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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
      .set('Auth-Token', users[1].token)
      .send('{"name":"pork", "blacklist": ["musulman"]}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal("pork");
        ingredients[1].id = res.body.id
        expect(res.body.blacklist[0]).to.equal("musulman");
        done()
      });
    });

    it ("200: ingredient is uniq", function(done){
     request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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
      .patch('localhost:8080/ingredients/'+ ingredients[0].id)
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
      .patch('localhost:8080/ingredients/' + ingredients[0].id)
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
      .patch('localhost:8080/ingredients/diowjoidw')
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

    it ("200: update chocolat -> choco", function(done){
     request
      .patch('localhost:8080/ingredients/' + ingredients[0].id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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
      .get('localhost:8080/ingredients/'+ ingredients[0].id)
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

    it ("200: resource not found", function(done){
     request
      .get('localhost:8080/ingredients/' + ingredients[0].id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
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
      .del('localhost:8080/ingredients/'+ ingredients[0].id)
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
      .del('localhost:8080/ingredients/' + ingredients[0].id)
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
      .del('localhost:8080/ingredients/fokjwpo')
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

    it ("200: delete choco", function(done){
     request
      .del('localhost:8080/ingredients/' + ingredients[0].id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
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
      .set('Auth-Token', users[0].token)
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
      .set('Auth-Token', users[0].token)
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
      .set('Auth-Token', users[0].token)
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
      .set('Auth-Token', users[0].token)
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
      .set('Auth-Token', users[0].token)
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

  describe('Upload image', function(){
    var base64Image = undefined

    before(function(done){
      fs.readFile(__dirname + '/datas/ingredient.jpg', function(err, original_data){
        base64Image = new Buffer(original_data, 'binary').toString('base64');
        done();
      });
    });

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/ingredients/' + ingredients[1].id + "/pictures")
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

    it ("403: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/ingredients/' + ingredients[1].id + "/pictures")
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        console.log(res.body)
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("400: no parameter `extend`", function(done){
     request
      .post('localhost:8080/ingredients/' + ingredients[1].id + "/pictures")
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("bad type, only png and jpg are supported");
        done()
      });
    });

    it ("400: no parameter `picture`", function(done){
     request
      .post('localhost:8080/ingredients/' + ingredients[1].id + "/pictures")
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"extend":"png"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("bad type, only png and jpg are supported");
        done()
      });
    });

    it ("200: image uploaded (base64)", function(done){
     request
      .post('localhost:8080/ingredients/' + ingredients[1].id + "/pictures")
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"extend":"jpg","picture":"'+base64Image+'"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.icon).to.equal("http://localhost:8080/pictures/ingredients/" + ingredients[1].id +".jpg");
        done()
      });
    });
  });
});
