var DB =require('./queries');
var dbConnection =require('./dbConnect');

const WishesSchema = {
  columns: {
    username: 'string',
    spotid: 'number',
    status: 'string',
    requestee: 'string'
  },
  tableName: 'wishes'
};

const Wishes = new DB(dbConnection, WishesSchema);

module.exports= Wishes;
