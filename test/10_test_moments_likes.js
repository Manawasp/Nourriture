var request = require('superagent'),
  expect = require('expect.js');

describe('RecipesLikes Controller', function(){
  var users = [{"id": 0, "token": ""},
               {"id": 0, "token": ""},
               {"id": 0, "token": ""}]
  var moment_is = "";
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
          .post('localhost:8080/moments/search')
          .set('Content-Type', 'application/json')
          .set('Auth-Token', users[1].token)
          .send('{}')
          .end(function(res)
        {
          expect(res.status).to.equal(200);
          expect(res.body.moments).to.exist;
          expect(res.body.moments.length).to.equal(1);
          moment_is = res.body.moments[0].id;
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

  describe('CREATE MomentsLikes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/like/moments/' + moment_is)
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
      .post('localhost:8080/like/moments/dowkpodwkpokwd')
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

    it ("200: like with success", function(done){
     request
      .post('localhost:8080/like/moments/' + moment_is)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("you like the moment");
        done()
      });
    });

    it ("400: already like", function(done){
     request
      .post('localhost:8080/like/moments/' + moment_is)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("you already like this moment");
        done()
      });
    });

  });

  describe('DELETE MomentsLikes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/like/moments/' + moment_is)
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
      .del('localhost:8080/like/moments/dowkpodwkpokwd')
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

    it ("200: unlike with success", function(done){
     request
      .del('localhost:8080/like/moments/' + moment_is)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("you unlike the moment");
        done()
      });
    });

    it ("400: already like", function(done){
     request
      .del('localhost:8080/like/moments/' + moment_is)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("you don't like this moment");
        done()
      });
    });

  });

});
