var _ =require('lodash');

const typeWrapper = function(thing, type){
  if(thing === null) return null;
  if (type === 'string') return `\'${thing}\'`;
  return thing;
}

module.exports.createInsertQuery = function (schema, objToInsert) {
  let query = `insert into ${schema.tableName}`;
  let columns = '('.concat(_
    .reduce(Object.keys(schema.columns), (columns, val) => `${columns}, ${val}`), '')
    .concat(')');
  let initial = true;
  let values = 'values ('.concat(_
    .reduce(schema.columns, (values, val, key) => {
      if (initial) {
        initial = false;
        return `${typeWrapper(objToInsert[key] || null, val)}`;
      }
      return `${values}, ${typeWrapper(objToInsert[key] || null, val)}`;
    }, ''))
    .concat(') returning *');
  console.log(`${query} ${columns} ${values}`);
  return `${query} ${columns} ${values}`;
};

module.exports.createUpdateQuery = function(schema, updateObj, id) {
  let query = `update ${schema.tableName} set`;
  let changes = _.reduce(updateObj, (columnChanges, val, key) => {
    return `${columnChanges} ${key} = ${typeWrapper(val, schema.columns[val])},`;
  }, '').concat(`where id = ${id}`);
  return `${query} ${changes};`;
};

module.exports.createSelectQuery = function(schema, findObj) {
  let query = `select * from ${schema.tableName} where`;
  let length = Object.keys(findObj).length;
  let i = 0;
  let params = _.reduce(findObj, (params, val, key) => {
    if (i === length - 1) {
      return `${params} ${key} = ${typeWrapper(val, schema.columns[key])}`;
    }
    i++;
    return `${params} ${key} = ${typeWrapper(val, schema.columns[key])} and`;
  }, '')
  console.log(`${query} ${params}`);
  return `${query} ${params}`
};

module.exports.sendBackJSON = function (res, data, message){
  return res.status(200)
    .json({
      data: data,
      message: message
    });
};
