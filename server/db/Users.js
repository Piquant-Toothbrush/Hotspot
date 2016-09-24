var _ = require('lodash');
var bcrypt = require( 'bcrypt-nodejs');
var dbConnection = require( './dbConnect');
var DB = require( './queries');
var {createInsertQuery} = require( './queryHelpers');

const userSchema = {
  columns: {
    name: 'string',
    username: 'string',
    password: 'string',
    facebookId: 'number',
    facebookAccessToken: 'string'
  },
  tableName: 'users'
};

class User extends DB {
  constructor(dbConnection, userSchema) {
    super(dbConnection, userSchema);
  }

  create(obj) {
    return this.pg.query(createInsertQuery(this.schema, {
      username: obj.username,
      password: this.generateHash(obj.password)
    }));
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  isValidPassword(password, id) {
    return this.find({id: id})
    .then((user) => {
      return bcrypt.compareSync(password, user[0].password);
    })
    .catch((err) => console.log(err));
  }
}

module.exports=  new User(dbConnection, userSchema);
