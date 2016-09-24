var DB =require('./queries');
var dbConnection =require('./dbConnect');

const FriendSchema = {
  columns: {
    username: 'string',
    friendname: 'string'
  },
  tableName: 'friends'
};

const Friends = new DB(dbConnection, FriendSchema);

module.exports= Friends;
