var DB = require('./queries');
var dbConnection = require('./dbConnect');

const spotUserSchema = {
  columns: {
    userid: 'number',
    spotid: 'number',
  },
  tableName: 'spots_users'
};

const SpotsUsers = new DB(dbConnection, spotUserSchema);

module.exports= SpotsUsers;
