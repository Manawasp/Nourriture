
/*
 * GET users listing.
 */

// just a dummy response for now, persistence we'll add later
var followersResponse =  {
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
    app.post('/followers', create);
    app.get('/followers/:uid', retrieve);
    app.delete('/followers/:uid', remove);
}

create = function(req, res){
	console.log('create !');
    res.type('application/json');
    res.send(200, followersResponse);
};

retrieve = function(req, res){
	console.log('retrieve !');
    res.type('application/json');
    res.send(200, followersResponse);
};

remove = function(req, res){
	console.log('remove !');
    res.type('application/json');
    res.send(200, followersResponse);
};