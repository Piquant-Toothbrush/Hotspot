var _ = require('lodash');
var createInsertQuery = require('./queryHelpers').createInsertQuery
var createUpdateQuery = require('./queryHelpers').createUpdateQuery
var sendBackJSON = require('./queryHelpers').sendBackJSON
var createSelectQuery = require('./queryHelpers').createSelectQuery

module.exports=  class DB {
  constructor(pgConnection, schema) {
    this.pg = pgConnection;
    this.schema = schema;
  }

  getAll() {
    return this.pg.query(`select * from ${this.schema.tableName}`);
  }

  getOne(id) {
    return this.pg.query(`select * from ${this.schema.tableName} where id = ${id}`);
  }

  find(obj) {
    return this.pg.query(createSelectQuery(this.schema, obj));
  }

  create(obj) {
    return this.pg.query(createInsertQuery(this.schema, obj))
  }

  findOrCreate(obj) {
    return this.find(obj)
    .then((foundObj) => {
      console.log('foundObj', foundObj)
      if (foundObj.length > 0) {
        return foundObj;
      }
      console.log('make this', obj);
      return this.create(obj);
    });
  }

  remove(id) {
    return this.pg.query(`delete from ${this.schema.tableName} where id = ${id}`);
  }

  rawQuery(queryString) {
    return this.pg.query(queryString);
  }
}
