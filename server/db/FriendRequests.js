var DB =require('./queries');
var dbConnection =require('./dbConnect');

const FriendRequestsSchema = {
  columns: {
    requestor: 'string',
    requestee: 'string',
    response: 'string'
  },
  tableName: 'friendrequests'
};

const FriendRequests = new DB(dbConnection, FriendRequestsSchema);

module.exports= FriendRequests;
