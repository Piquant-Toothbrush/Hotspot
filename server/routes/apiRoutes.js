var Spot =require('../db/Spots');
var SpotsUsers =require( '../db/spotsUsersJoin');
var sendBackJSON =require('../db/queryHelpers').sendBackJSON;
var requestMultipleYelp =require('../yelp/yelpQuery').requestMultipleYelp
var generateYelpNewBusParam  =require('../yelp/yelpQuery').generateYelpNewBusParam
var requestYelp =require('../yelp/yelpQuery').requestYelp
var Promise =require( 'bluebird');
var _ =require( 'lodash');
var Friends =require( '../db/Friends');
var FriendRequests =require( '../db/FriendRequests');
var Wishes =require( '../db/Wishes');
var Users =require( '../db/Users');

module.exports= function(app) {
  // RESTFUl API for retrieving spots from the db
  app.get('/api/spots', (req, res) => {

    let spotsReturn;
    if (!req.user) {
      req.user = {
        id: Math.random() * 1000,
        username: 'defaultUser'
      };
    }
    console.log('user', req.user);
    Spot.getAllForUser(req.user)
      .then((spots) => {
        // console.log('spotssss',spots);
        if (spots.length === 0) {
          spotsReturn = [];
          // return sendBackJSON(res, [], 'no spots');
          // return [];
        } else {
          spotsReturn = spots;
        }

        return getOtherFriendSpot(req.user.username)
        .then(friendSpots => {
          var friendSpots = friendSpots.map(friendSpot => {
            friendSpot.friendWishOnly = true;
            return friendSpot;
          });
          // console.log('friendSpots', friendSpots);
          spotsReturn = spotsReturn.concat(friendSpots);
          return requestMultipleYelp(spotsReturn.map((spot) => {
            return generateYelpNewBusParam(spot.name, spot.longitude, spot.latitude, spot.friendWishOnly);
          }));
        })


      })
      .then((yelpResults) => {
        // console.log('yelpresults looking for busid location', yelpResults);
        if (yelpResults.length === 0) {
          return [];
        }
        return Promise.map(spotsReturn, (spot) => {
          // console.log('spotssssss', spot)
          let match = yelpResults.filter((result) => {
            let lowerLength = Math.min([spot.length, result.length]);
            return result.name.indexOf(spot.name.slice(lowerLength)) !== -1;
          });
          // console.log('yelp stuff', match);
          if (match.length === 0) {
            spot.yelpData = {
              cuisine: null,
              image: null
            };
          } else {
            spot.yelpData = match[0];
          }
          // console.log('new spot', spot);
          return yourWishOnSpot(spot, req.user.username)
          .then(wishSpot => {
            return friendWishesOnSpot(wishSpot, req.user.username);
          })
        });
      })
      .then((augmentedSpots) => {
        //add spots your friend wished
        // console.log('augmentedSpots', augmentedSpots);
        sendBackJSON(res, augmentedSpots, 'got all spots')
      })
      .catch((err) => console.log(err));
  });

  app.get('/api/spots/:id', (req, res) => {
    Spot.getOne(req.params.id)
      .then((spot) => sendBackJSON(res, spot, 'got one spot'))
      .catch((err) => console.log(err));
  });

  app.post('/api/spots', (req, res) => {
    console.log('req.user', req.user);
    // console.log('/api/spots req.body', req.body);
    Spot.find({name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude})
    .then((spot) => {
      // console.log('found spot', spot);
      if (spot.length > 0) {
        return SpotsUsers.find({userid: req.user.id, spotid: spot[0].id})
        .then((spotuser) => {
          if (spotuser.length > 0) {
            return spotuser;
          } else {
            return SpotsUsers.create({userid: req.user.id, spotid: spot[0].id});
          }
        })
      } else {
        // console.log('creating spot');
        return Spot.create(req.body)
        .then((spot) => {
          // console.log('insert spot ', spot[0], 'with user id', req.user);
          return SpotsUsers.create({userid: req.user.id, spotid: spot[0].id});
        })
      }
    })
    .then((spotuser) => {
      // console.log('created new spot', spotuser);
      sendBackJSON(res, req.body, 'created new spot')
    })
    .catch((err) => {
      console.log(err);
      return sendBackJSON(res, err, 'error');
    });
  });

  app.put('/api/spots/:id', (req, res) => {
    Spot.update(req.body)
      .then((result) => sendBackJSON(res, result, 'updated a spot'))
      .catch((err) => sendBackJSON(res, err, 'error'));
  });

  app.delete('/api/spots/:id', (req, res) => {
    Spot.update(req.body)
      .then((result) => sendBackJSON(res, result, 'updated a spot'))
      .catch((err) => sendBackJSON(res, err, 'error'));
  });

  app.post('/api/yelp', (req, res) => {
    // console.log('req.body', req.body);
    requestYelp(req.body, null, true)
    .then(function(data){
      // console.log('yelp data', data);
      sendBackJSON(res, data, 'got all spots')
    })
    .catch(function(err){
      console.log(err);
      res.send(err);
    })
  });

  //sent friend request
  app.post('/api/friendRequest', (req, res) => {
    // Friends.find({username: req.user.username})
    // console.log('req.body', req.body);
    var friendQuery = 
      `SELECT * FROM friends 
      INNER JOIN users 
      ON friends.username=users.username
      WHERE users.username = '${req.user.username}'
      AND friends.friendname = '${req.body.requestee}';`;
    
    Users.find({username: req.body.requestee})
    .then(foundFriend => {
      if (foundFriend.length === 0) {
        res.send('the friend you entered does not exist');
      } else {
        return Friends.rawQuery(friendQuery)
        .then(friend => {
          // console.log('friend',friend);
          if (friend.length === 0) {
            //another query to see if friend request already exists
            return FriendRequests.find({requestor: req.user.username, requestee: req.body.requestee})
            .then((request) => {
              if (request.length === 0) {
                return FriendRequests.create({requestor: req.user.username, requestee: req.body.requestee, response: 'pending'})
                .then((request) => {
                  // console.log('request stored', request)
                  res.send('friend request sent');
                })
              } else {
                res.send('you have already send a friend request to ' + req.body.requestee);
              }
            });
          } else {
            res.send(req.body.requestee, ' is already a friend');
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error');
    });
  });

  //get friend
  app.get('/api/friends', (req, res) => {
    Friends.find({username: req.user.username})
    .then((friends) => {
      console.log('found friends', friends)
      sendBackJSON(res, friends, 'sending a list of friends')
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error')
    });
  });

  //get friend request to other
  app.get('/api/friendRequest', (req, res) => {
    FriendRequests.find({requestor: req.user.username})
    .then((friendRequest) => {
      console.log('pending!!!!!!!!!!',friendRequest);
      sendBackJSON(res, friendRequest, 'sending a list of friendRequest')
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error')
    });
  });

  //get friend request to you
  app.get('/api/pendingFriendRequest', (req, res) => {
    var friendRequestQuery = 
      `SELECT * FROM friendrequests 
      WHERE friendrequests.requestee = '${req.user.username}'
      AND friendrequests.response = 'pending';`;

    FriendRequests.rawQuery(friendRequestQuery)
    .then((pendingFriendRequest) => {
      sendBackJSON(res, pendingFriendRequest, 'sending a list of pendingFriendRequest')
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error')
    });
  });

  //accept friend request
  app.post('/api/confirmFriend', (req, res) => {
    console.log('req.body', req.body);
    FriendRequests.find({requestee: req.user.username, requestor: req.body.friendname})
    .then((request) => {
      if (request.length > 0 && request[0].response !== 'accepted') {
        var acceptQuery = 
        `UPDATE friendrequests 
        SET response = 'accepted'
        WHERE requestor = '${req.body.friendname}'
        AND requestee = '${req.user.username}';`;

        return Friends.rawQuery(acceptQuery)
        .then((acceptedRequest) => {
          console.log('acceptedRequest', acceptedRequest);
          return Friends.create({username: req.body.friendname, friendname: req.user.username})
          .then((newfriend) => {
            console.log('newfriend', newfriend);
            return Friends.create({username: req.user.username, friendname: req.body.friendname})
          })
        })
        .then((newfriend) => {
          if (newfriend.length > 0) {
            console.log('friend created', newfriend);
            sendBackJSON(res, newfriend, 'sending new friend');
          }
        })
      } else {
        console.log('friend request does not exists', request);
        res.send('friend request does not exists');
        return request;
      }
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error')
    });
  });

  //reject friend request
  app.post('/api/rejectFriend', (req, res) => {
    console.log('rejectFriend', req.body);
    FriendRequests.find({requestee: req.user.username, requestor: req.body.friendname})
    .then((request) => {
      if (request.length > 0  && request[0].response !== 'rejected') {
        var rejectQuery = 
        `UPDATE friendrequests 
        SET response = 'rejected'
        WHERE requestor = '${req.body.friendname}'
        AND requestee = '${req.user.username}';`;

        return Friends.rawQuery(rejectQuery)
        .then(rejectedRequest => {
          console.log('rejectedRequest', rejectedRequest);
          sendBackJSON(res, rejectedRequest, 'sending rejected request');
          return rejectedRequest;
        })
      } else {
        console.log('friend request does not exists', request);
        res.send('friend request does not exists');
        return request;
      }
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error')
    });
  });

  //clear friend request
  app.post('/api/clearFriendRequest', (req, res) => {
    var deleteQuery = 
      `DELETE FROM friendrequests 
      WHERE requestor = '${req.body.friendname}'
      AND requestee = '${req.user.username}';`;

    Friends.rawQuery(deleteQuery)
    .then((deletedRequest) => {
      res.send('friend request deleted');
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error')
    });
  });

  //add your own wishes
  app.post('/api/wishes', (req, res) => {
    var findWishQuery = 
      `SELECT wishes.spotid, spots.name FROM wishes 
      INNER JOIN users 
      ON wishes.username=users.username
      INNER JOIN spots 
      ON wishes.spotid=spots.id
      WHERE users.username = '${req.user.username}'
      AND spots.name = '${req.body.name}'
      AND spots.latitude = '${req.body.latitude}'
      AND spots.longitude = '${req.body.longitude}';`;

    Wishes.rawQuery(findWishQuery)
    .then((foundWish) => {
      if (foundWish.length > 0) {
        // console.log('foundWish', foundWish);
        res.send('wish already exists');
      } else {
        // console.log('wish not found', foundWish);
        return Spot.findOrCreate({name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude})
        // return Spot.find({name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude})
        .then(spot => {
          // console.log('spot', spot);
          return SpotsUsers.findOrCreate({spotid: spot[0].id, userid: req.user.id})
          .then(spotuser => {
            // console.log('spotuser', spotuser);
            return Wishes.create({username: req.user.username, spotid: spotuser[0].spotid, status: 'open', requestee: 'none'})
            .then(wish => {
              // console.log('wish created');
              sendBackJSON(res, wish, 'wish created');
              return wish;
            })
          })
        })
      }
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error')
    });
  });

  //get friend wishes
  app.get('/api/friendWishes', (req, res) => {
    var friendWishQuery = 
      `SELECT * FROM wishes 
      INNER JOIN friends 
      ON wishes.username=friends.friendname
      INNER JOIN users
      ON users.username=friends.username
      INNER JOIN spots
      ON wishes.spotid=spots.id
      WHERE users.username = '${req.user.username}';`;

    Wishes.rawQuery(friendWishQuery)
    .then(friendWishes => {
      // console.log('friendWishes', friendWishes);
      sendBackJSON(res, friendWishes, 'sending new friend');
    })
    .catch((err) => {
      console.log(err);
      sendBackJSON(res, err, 'error');
    });
  });

  app.post('/api/acceptWishes', (req, res) => {
    var acceptWishQuery = 
      `SELECT * FROM wishes 
      INNER JOIN friends 
        ON wishes.username=friends.friendname
      INNER JOIN users
        ON users.username=friends.username
      INNER JOIN spots
        ON wishes.spotid=spots.id
        WHERE users.username = '${req.user.username}'
        AND friends.friendname = '${req.body.friendname}'
        AND spots.latitude = '${req.body.latitude}'
        AND spots.longitude = '${req.body.longitude}'
        AND spots.name = '${req.body.name}';`;

    Wishes.rawQuery(acceptWishQuery)
    .then(wish => {
      console.log('wishwish', wish);
      var wishUpdate = 
        `UPDATE wishes 
        SET status = '${req.body.wishstatus}', 
          requestee = '${req.user.username}'
        WHERE id = '${wish[0].id}';`;

      return Wishes.rawQuery(wishUpdate)
      .then(acceptedWish => {
        sendBackJSON(res, acceptedWish, 'accepted friend wishes');
      })
    })
    .catch((err) => {
      console.log('wishwish, ', err);
      sendBackJSON(res, err, 'error');
    });
  });


  //get all user saved spots and argment results with wish data
  //get all user wish spots
  //get all friend wish spots

  // {
  //   restaurantData,
  //   rating: 5 or 0,
  //   friendWish: [friends],
  //   yourWish: boolean,
  //   wishStatus: 'pending' or 'fulfilled',
  //   wishFulfilledby: 'friendname',
  //   fulfilFriendWish: boolean,
  //   friendData: boolean
  // }


  app.get('/api/test', (req, res) => {
    // console.log('req.query', req.query);
    var spot = req.query;
    yourWishOnSpot(spot, req.query.username, res)
    .then(wishSpot => {
      friendWishesOnSpot(wishSpot, req.query.username, res);
    })
  });

  app.get('/api/test2', (req, res) => {
    // console.log('req.query for test2', req.query);
    var spot = req.query;
    friendWishesOnSpot(spot, req.query.username, res);
  });

  app.get('/api/test3', (req, res) => {
    // console.log('req.query for test3', req.query);
    getOtherFriendSpot(req.query.username, res);
  });
}

//helper functions
//mark whether the spot is your wish spot
var yourWishOnSpot = (spot, username, res) => {
  var findWishQuery = 
    `SELECT * FROM wishes 
    INNER JOIN users 
    ON wishes.username=users.username
    INNER JOIN spots 
    ON wishes.spotid=spots.id
    WHERE users.username = '${username}'
    AND spots.name = '${spot.name}'
    AND spots.latitude = '${spot.latitude}'
    AND spots.longitude = '${spot.longitude}';`;

  return Wishes.rawQuery(findWishQuery)
  .then(found => {
    if (found.length > 0) {
      // console.log('found', found);
      spot.yourWish = true;
      spot.wishStatus = found[0].status;
      spot.wishFulfilledby = found[0].requestee;
      // sendBackJSON(res, spot, 'sending spot');
      return spot;
    } else {
      spot.yourWish = false;
      // sendBackJSON(res, spot, 'sending spot');
      return spot;
    }
  })
  .catch(err => {
    console.log(err);
  })
}

//find friends who wish this spot
var friendWishesOnSpot = (spot, username, res) => {
  var friendWishQuery = 
    `SELECT friends.friendname, wishes.status AS fulfilFriendWish FROM wishes 
    INNER JOIN friends
    ON wishes.username=friends.friendname
    INNER JOIN users 
    ON friends.username=users.username
    INNER JOIN spots 
    ON wishes.spotid=spots.id
    WHERE users.username = '${username}'
    AND spots.name = '${spot.name}'
    AND spots.latitude = '${spot.latitude}'
    AND spots.longitude = '${spot.longitude}'
    AND (wishes.status = 'open' OR wishes.requestee = '${username}');`;

  return Wishes.rawQuery(friendWishQuery)
  .then(friendWishes => {
    // console.log('friendWishes', friendWishes);
    spot.friendWish = friendWishes;

    for (var i = 0; i < friendWishes.length; i++) {
      if (friendWishes[i].fulfilfriendwish === 'accepted') {
        spot.fulfilfriendwish = true;
        // sendBackJSON(res, spot, 'sending spot'); 
        return spot;
      }
    }

    spot.fulfilfriendwish = false;
    // sendBackJSON(res, spot, 'sending spot');    
    return spot;
  })
  .catch(err => {
    console.log(err);
  })
}

var getOtherFriendSpot = (username) => {
  return Users.find({username: username})
  .then(user => {
    // console.log('calling getOtherFriendSpot user', user);
    var friendWishQuery = 
    `SELECT DISTINCT spots.name, spots.latitude, spots.longitude FROM spots
    INNER JOIN wishes
    ON wishes.spotid=spots.id
    INNER JOIN users
    ON users.username=wishes.username  
    INNER JOIN friends
    ON friends.friendname=users.username
    WHERE friends.username = '${username}'
    AND wishes.status = 'open'
    AND wishes.username != '${username}';`;

    return Spot.rawQuery(friendWishQuery)
    .then(friendSpots => {
      // console.log('logging friendSpots', friendSpots);
      return friendSpots;
    })
  })
  .catch(err => {
    console.log(err);
  })
}
