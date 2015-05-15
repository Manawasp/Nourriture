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

  describe('INIT Ingredient', function(){
    var createIngredient = function(name, url, typeImg, done) {
      request
      .post('localhost:8080/ingredients')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"name":"'+name+'"}')
      .end(function(res)
      {
        expect(res).to.exist;
        if (res.status == 400) {
          done(new Error('Ingredient already exist : ' + name));
        }
        else {
          expect(res.status).to.equal(200);
          ingredients[1].id = res.body.id
          // ouvre le fichier
          fs.readFile(__dirname + '/images/ingredients/' + url, function(err, original_data){
            if (err) {
              done(new Error('image not found : '+ __dirname + '/images/ingredients/' + url));
            } else {
              base64Image = new Buffer(original_data, 'binary').toString('base64');
              // Lqncereauete pour enregister l'image
              request
              .post('localhost:8080/ingredients/' + ingredients[1].id + "/pictures")
              .set('Content-Type', 'application/json')
              .set('Auth-Token', users[1].token)
              .send('{"extend":"'+typeImg+'","picture":"'+base64Image+'"}')
              .end(function(res)
              {
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.body.icon).to.match(/^http:\/\/localhost:8080\/pictures\/ingredients\/(.*).jpg$/);
                // Line to validate
                done()
              });
            }
          });
        }
      });
    }
    it ("200: ingredient is uniq", function(done){
      createIngredient("apricot", "Apricot.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("artemisia absinthium", "Artemisia_absinthium.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
	createIngredient("baking powder", "Baking_powder.jpg", "jpg", done)
	});
	    it ("200: ingredient is uniq", function(done){
      createIngredient("baking soda", "Baking_soda.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("banana", "Banana.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("basil", "Basil.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("beef", "Beef.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("black pepper", "Black_pepper.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("breadcrumbs", "Breadcrumbs.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("butter", "Butter.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("buttermilk", "Buttermilk.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("carott", "Carott.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("chicken", "Chicken.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("chili", "Chili.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("cilantro", "Cilantro.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("curry", "Curry.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("eggs", "Eggs.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("elattaria cardamomum", "Elattaria_cardamomum.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("feta greece", "Feta_greece.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("flour", "Flour.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("garlic", "Garlic.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("husked", "Husked.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("oil", "Oil.jpg", "jpg", done)
    });
    	it ("200: ingredient is uniq", function(done){
      createIngredient("olive", "Olive.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("onion", "Onion.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("oregano", "Oregano.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("paprika", "Paprika.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("paremsan", "Parmesan.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("pasta", "Pasta.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("peanut", "Peanut.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("pineapple", "Pineapple.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("red pepper", "Red_pepper.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("rice", "Rice.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("salmon fillet", "Salmon_fillets.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("salt", "Salt.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("spinach", "Spinach.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("strawberries", "Strawberries.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("sugar", "Sugar.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("tarragon", "Tarragon.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("tomatillos", "Tomatillos.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("tomatoes", "Tomatoes.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("turkey", "Turkey.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("vanilla", "Vanilla.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("zucchini", "Zucchini.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("ricotta", "Ricotta.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("reduced fat cream cheese", "Reduced_fat_cream_cheese.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("lemon juice", "Lemon_juice.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("extract vanilla", "Extract_vanilla.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("mustard", "Mustard.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("berry", "Berry.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("radish", "Radish.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("turnip", "Turnip.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("mustard green", "Mustard_green.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("red wine", "Red_wine.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("duck", "Duck.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("coffee", "Coffee.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("caramel", "Caramel.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("double cream", "Double_cream.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("milk", "Milk.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("pecan", "Pecan.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("cinnamon", "Cinnamon.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("clove", "Clove.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("orange", "Orange.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("quince", "Quince.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("apple", "Apple.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("pear", "Pear.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("backberry", "Blackberry.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("lime", "Lime.jpg", "jpg", done)
    })
    it ("200: ingredient is uniq", function(done){
      createIngredient("mango", "Mango.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("plum", "Plum.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("meringues", "Meringues.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("mascarpone", "Mascarpone.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("oats", "Oats.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("seeds", "Seeds.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("nuts", "Nuts.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("soy sauce", "Soy_sauce.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("ginger", "Ginger.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("almonds", "Almonds.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("sake", "Sake.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("leek", "Leek.jpg", "jpg", done)
    });
	it ("200: ingredient is uniq", function(done){
      createIngredient("honey", "Honey.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("ham", "Ham.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("bread", "Bread.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("chedar", "Chedar.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("Worcestershire sauce", "Worcestershire_sauce.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("thyme", "Thyme.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("lamb", "Lamb.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("potato", "Potato.jpg", "jpg", done)
    });
    it ("200: ingredient is uniq", function(done){
      createIngredient("parsley", "Parsley.jpg", "jpg", done)
    });
  })
})
