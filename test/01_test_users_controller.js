var request = require('superagent'),
  expect = require('expect.js');
  
describe('User Controller', function(){
  describe('CREATE User', function(){
   it ('400: pseudo - empty', function(done){
     request
      .post('localhost:8080/users')
      .send('{}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('pseudo is undefined');
        // expect(res.body).to.contain('world');
        done()
     });
    });

   it ("400: pseudo - can't have special char", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "b&*^^)30a"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('pseudo must contain only letters, numbers and underscores');
        // expect(res.body).to.contain('world');
        done()
     });
    });

   it ("400: pseudo - length less than 3", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "#$"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('pseudo contain at least 3 characters');
        // expect(res.body).to.contain('world');
        done()
     });
    });

   it ("400: email - empty", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('email is undefined');
        // expect(res.body).to.contain('world');
        done()
     });
    });

   it ("400: email - invalid", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "hello"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("email must be validate email");
        // expect(res.body).to.contain('world');
        done()
     });
    });

   it ("400: password - empty", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "manawasp@gmail.com"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("password is undefined");
        // expect(res.body).to.contain('world');
        done()
     });
    });

   it ("400: password - length less than 6", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "manawasp@gmail.com", "password": "we"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("password must contain at least 6 characters");
        // expect(res.body).to.contain('world');
        done()
     });
    });

   it ("400: password - no number", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "manawasp@gmail.com", "password": "wdwewe"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("password must contain at least one number (0-9)");
        done()
     });
    });

   it ("400: password - no lowercase", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "manawasp@gmail.com", "password": "809EFOEFOJFE"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("password must contain at least one lowercase letter (a-z)");
        done()
     });
    });

   it ("400: password - no uppercase", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "manawasp@gmail.com", "password": "809euhdiuhui"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("password must contain at least one uppercase letter (A-Z)");
        done()
     });
    });

   it ("200: create with success", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "manawasp@gmail.com", "password": "Manawasp59"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
     });
    });

   it ("200: create another user for test", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp2", "email": "manawasp2@gmail.com", "password": "Manawasp59"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
     });
    });

   it ("200: create superadmin to test", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "superadmin", "email": "superadmin@gmail.com", "password": "Superadmin59"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
     });
    });

   it ("400: email - email already taken", function(done){
     request
      .post('localhost:8080/users')
      .send('{"pseudo": "manawasp", "email": "manawasp@gmail.com", "password": "Manawasp59"}')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("this email is already taken");
        done()
      });
    });
  });

  describe('RETRIEVE User', function(){
    var user1_token = "";
    var user1_id = undefined;
    var user2_token = "";
    var user2_id = undefined;

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
        // expect(res.status).to.equal(400);
        // expect(res.body).to.contain('world');
       request
        .post('localhost:8080/sessions')
        .send('{"email": "manawasp2@gmail.com", "password": "Manawasp59"}')
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
          // expect(res.status).to.equal(400);
          // expect(res.body).to.contain('world');
          done()
        });
      });
    })

    it ("200: my private information", function(done){
     request
      .get('localhost:8080/users/'+ user1_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.email).to.equal("manawasp@gmail.com");
        done()
      });
    });

    it ("200: no access to other private user informations'", function(done){
     request
      .get('localhost:8080/users/'+ user1_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.email).not.to.exist;
        done()
      });
    });

    it ("404: user resource doesn't exist", function(done){
     request
      .get('localhost:8080/users/okfepkfepokfeopk')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/users/okfepkfepokfeopk')
      .set('Content-Type', 'application/json')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });
  });

    describe('UPDATE User', function(){
    var user1_token = "";
    var user1_id = undefined;
    var user2_token = "";
    var user2_id = undefined;

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
          .send('{"email": "manawasp2@gmail.com", "password": "Manawasp59"}')
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
  
    it ("401: unhautorized if not connected", function(done){
     request
      .patch('localhost:8080/users/okfepkfepokfeopk')
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

    it ("404: user resource doesn't exist", function(done){
     request
      .patch('localhost:8080/users/okfepkfepokfeopk')
      .set('Content-Type', 'application/json')
      .send('{}')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("403: can't update an other user profile", function(done){
     request
      .patch('localhost:8080/users/' + user2_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("200: update user information", function(done){
     request
      .patch('localhost:8080/users/' + user1_id)
      .set('Content-Type', 'application/json')
      .send('{"lastname": "SirClovis"}')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.lastname).exist;
        expect(res.body.lastname).to.equal("SirClovis")
        done()
      });
    });
  });


  describe('DELETE User', function(){
    var user1_token = "";
    var user1_id = undefined;
    var user2_token = "";
    var user2_id = undefined;

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
          .send('{"email": "manawasp2@gmail.com", "password": "Manawasp59"}')
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

   it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/users/okfepkfepokfeopk')
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

    it ("404: user resource doesn't exist", function(done){
     request
      .del('localhost:8080/users/okfepkfepokfeopk')
      .set('Content-Type', 'application/json')
      .send('{}')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("403: can't update an other user profile", function(done){
     request
      .del('localhost:8080/users/' + user2_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("202: Delete user information", function(done){
     request
      .del('localhost:8080/users/' + user1_id)
      .set('Content-Type', 'application/json')
      .send('{"lastname": "SirClovis"}')
      .set('Auth-Token', user1_token)
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(202);
        expect(res.body.success).exist;
        expect(res.body.success).to.equal("non implemente")
        done()
      });
    });
  });

  describe('SEARCH User', function(){
    var user1_token = "";
    var user1_id = undefined;

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
       done()
      });
    })

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/users/search')
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
      .post('localhost:8080/users/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.users).to.exist;
        expect(res.body.users.length).to.equal(3);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(3);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search with pattern", function(done){
     request
      .post('localhost:8080/users/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"pseudo":"manawasp2"}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.users).to.exist;
        expect(res.body.users.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search with pattern + offset + limit", function(done){
     request
      .post('localhost:8080/users/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"pseudo":"manawasp2","offset":10,"limit":2}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.users).to.exist;
        expect(res.body.users.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(10);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.equal(2);
        done()
      });
    });
  });
});