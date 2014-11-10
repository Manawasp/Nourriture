
/*
 * GET users listing.
 */

// just a dummy response for now, persistence we'll add later
var usersResponse =  {
    "name":"Monty Python and the search for the holy grail",
    "id":123,
    "startPrice":0.69,
    "currency":"GBP",
    "description":"Must have item",
    "links":[
        {
            "linkType":"application/vnd.smartbid.item",
            "rel":"Add item to watchlist",
            "href":"/users/123/watchlist"
        },
        {
            "linkType":"application/vnd.smartbid.bid",
            "rel":"Place bid on item",
            "href":"/items/123/bid"
        },
        {
            "linkType":"application/vnd.smartbid.user",
            "rel":"Get owner's details",
            "href":"/users/123"
        }
    ]
};
 
module.exports = function(app) {
    app.get('/users', search);
    app.post('/users', create);
    app.get('/users/:uid', retrieve);
    app.patch('/users/:uid', update);
    app.delete('/users/:uid', remove);
}
 
search = function(req, res){
	console.log('search !');
    res.type('application/json');
    res.send(200, usersResponse);
};

create = function(req, res){
	console.log('create !');
    res.type('application/json');
    res.send(200, usersResponse);
};

retrieve = function(req, res){
	console.log('retrieve !');
    res.type('application/json');
    res.send(200, usersResponse);
};

update = function(req, res){
	console.log('update !');
    res.type('application/json');
    res.send(200, usersResponse);
};

remove = function(req, res){
	console.log('remove !');
    res.type('application/json');
    res.send(200, usersResponse);
};