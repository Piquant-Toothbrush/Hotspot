var _ = require('lodash');
var DB = require( './queries');
var dbConnection = require( './dbConnect');
var SpotsUsers = require( './spotsUsersJoin');
var Promise = require( 'bluebird');

const spotSchema = {
  columns: {
    name: 'string',
    rating: 'string',
    latitude: 'number',
    longitude: 'number',
    yelp_id: 'string'
  },
  tableName: 'spots'
};

class Spot extends DB {
  constructor(dbConnection, schema) {
    super(dbConnection, schema);
  }

  getAllForUser(user) {
    return SpotsUsers.find({userid: user.id})
      .then((spotsUsers) => {
        return Promise.all(spotsUsers.map((spotUser) => this.find({id: spotUser.spotid})));
      })
      .then((results) => results.map((result) => result[0]))
      .catch((err) => console.log(err));
  }
}

module.exports=  new Spot(dbConnection, spotSchema);
