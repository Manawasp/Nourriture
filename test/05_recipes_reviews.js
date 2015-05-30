var request = require('superagent'),
  expect = require('expect.js');

describe('Recipesreviews Controller', function(){
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

  describe('CREATE Recipesreviews', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/reviews/recipes/' + recipe_id)
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
      .post('localhost:8080/reviews/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("bad parameter");
        done()
      });
    });

    it ("400: comment length's is too small", function(done){
     request
      .post('localhost:8080/reviews/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"comment": "21"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("bad parameter");
        done()
      });
    });

    it ("200: user post comment in recipe", function(done){
     request
      .post('localhost:8080/reviews/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"comment": "Hello", "mark": 5}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal('Review added');
        comment_id = res.body.id;
        done()
      });
    });

  });

  // describe('GET Recipesreviews', function(){
  //
  //   it ("401: unhautorized if not connected", function(done){
  //    request
  //     .get('localhost:8080/reviews/recipes/' + recipe_id)
  //     .set('Content-Type', 'application/json')
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(401);
  //       expect(res.body.error).to.equal("you need to be connected");
  //       done()
  //     });
  //   });
  //
  //   it ("404: resource not found", function(done){
  //    request
  //     .get('localhost:8080/reviews/recipes/okokokokkoko')
  //     .set('Content-Type', 'application/json')
  //     .set('Auth-Token', users[0].token)
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(404);
  //       expect(res.body.error).to.equal("route not found");
  //       done()
  //     });
  //   });
  //
  //   it ("200: get comment", function(done){
  //    request
  //     .get('localhost:8080/reviews/recipes/' + recipe_id)
  //     .set('Content-Type', 'application/json')
  //     .set('Auth-Token', users[0].token)
  //     .send('{"offset": 0, "limit":10}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(200);
  //       expect(res.body.max).to.equal(1);
  //       done()
  //     });
  //   });

  // })

  // describe('UPDATE Recipesreviews', function(){
  //
  //   it ("401: unhautorized if not connected", function(done){
  //    request
  //     .patch('localhost:8080/reviews/recipes/' + recipe_id)
  //     .set('Content-Type', 'application/json')
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(401);
  //       expect(res.body.error).to.equal("you need to be connected");
  //       done()
  //     });
  //   });
  //
  //   it ("404: resource not found", function(done){
  //    request
  //     .patch('localhost:8080/reviews/recipes/odkwodkwokwd')
  //     .set('Content-Type', 'application/json')
  //     .set('Auth-Token', users[0].token)
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(404);
  //       expect(res.body.error).to.equal("resource not found");
  //       done()
  //     });
  //   });
  //
  //   it ("200: update comment", function(done){
  //    request
  //     .patch('localhost:8080/reviews/recipes/' + recipe_id)
  //     .set('Content-Type', 'application/json')
  //     .set('Auth-Token', users[1].token)
  //     .send('{"comment": "super plus long", "mark": 3}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(200);
  //       expect(res.body.comment).to.equal("Review updated");
  //       done()
  //     });
  //   });
  //
  // })

  // describe('DELETE Recipesreviews', function(){
  //
  //   it ("401: unhautorized if not connected", function(done){
  //    request
  //     .del('localhost:8080/reviews/recipes/' + recipe_id)
  //     .set('Content-Type', 'application/json')
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(401);
  //       expect(res.body.error).to.equal("you need to be connected");
  //       done()
  //     });
  //   });
  //
  //   it ("403: not the creator", function(done){
  //    request
  //     .del('localhost:8080/reviews/recipes/' + recipe_id)
  //     .set('Content-Type', 'application/json')
  //     .set('Auth-Token', users[0].token)
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(403);
  //       expect(res.body.error).to.equal("you don't have the permission");
  //       done()
  //     });
  //   });
  //
  //   it ("404: resource not found", function(done){
  //    request
  //     .del('localhost:8080/reviews/recipes/plj')
  //     .set('Content-Type', 'application/json')
  //     .set('Auth-Token', users[1].token)
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(404);
  //       expect(res.body.error).to.equal("resource not found");
  //       done()
  //     });
  //   });
  //
  //   it ("200: delete comment", function(done){
  //    request
  //     .del('localhost:8080/reviews/recipes/' + recipe_id + '/' + comment_id)
  //     .set('Content-Type', 'application/json')
  //     .set('Auth-Token', users[1].token)
  //     .send('{}')
  //     .end(function(res)
  //     {
  //       expect(res).to.exist;
  //       expect(res.status).to.equal(200);
  //       expect(res.body.success).to.equal("comment removed");
  //       done()
  //     });
  //   });
  //
  // })

  describe('SEARCH Recipesreviews', function(){


    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/reviews/recipes/' + recipe_id + '/search')
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
      .post('localhost:8080/reviews/recipes/okdwopkwpdok/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        done()
      });
    });

    it ("200: search with valid recipes", function(done){
     request
      .post('localhost:8080/reviews/recipes/' + recipe_id + '/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.reviews).to.exist;
        expect(res.body.reviews.length).to.equal(1);
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
