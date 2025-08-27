const con = require('./db');


module.exports.executeQuery = (query) => {
    return new Promise(function (resolve, reject) {
        con.query(query, (err, result, fields) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
};

module.exports.executeQueryWithObj = (query, postObj) => {
    return new Promise(function (resolve, reject) {
        con.query(query, postObj, (err, result, fields) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
};

module.exports.find = async (tableName) => {
    const query = `SELECT * from ${tableName}`;
    return await this.executeQuery(query);
};

module.exports.findByFieldname = async (tableName, field, value) => {
    const query = `SELECT * from ${tableName} WHERE ${field}='${value}'`;
    return await this.executeQuery(query);
};

module.exports.findAndOrder = async (tableName, orderBy, orderType) => {
    const query = `SELECT * from ${tableName} ORDER BY ${orderBy} ${orderType}`;
    return await this.executeQuery(query);
};

module.exports.findByField = async (tableName, field, value, orderBy, orderType) => {
    const query = `SELECT * from ${tableName} WHERE ${field}='${value}' ORDER BY ${orderBy} ${orderType}`;
    return await this.executeQuery(query);
};

module.exports.findById = async (tableName, id) => {
    const query = `SELECT * from ${tableName} WHERE _id=${id}`;
    return await this.executeQuery(query);
};

module.exports.findByIdAndDelete = async (tableName, id) => {
    const query = `DELETE from ${tableName} WHERE _id=${id}`;
    return await this.executeQuery(query);
};

module.exports.findOneAndDelete = async (tableName, field, value) => {
    const query = `DELETE from ${tableName} WHERE '${field}'='${value}'`;
    return await this.executeQuery(query);
};

module.exports.create = async (tableName, postObj) => {
    const query = `INSERT INTO ${tableName} SET ?`;
    return await this.executeQueryWithObj(query, postObj);
};

module.exports.findByIdAndUpdate = async (tableName, postObj, id) => {
    const query = `UPDATE ${tableName} SET ? WHERE _id=${id}`;
    return await this.executeQueryWithObj(query, postObj);
};

module.exports.findByFieldnameAndUpdate = async (tableName, postObj, field, value) => {
    const query = `UPDATE ${tableName} SET ? where ${field}='${value}'`;
    return await this.executeQueryWithObj(query, postObj);
};

module.exports.findBytwoFieldnameAndUpdate = async (tableName, postObj, field1, value1, field2, value2) => {
    const query = `UPDATE ${tableName} SET ? where ${field1}='${value1}' and ${field2}='${value2}' `;
    return await this.executeQueryWithObj(query, postObj);
};

module.exports.findByFieldnameAndDelete = async (tableName, field, value, field2, value2) => {
    const query = `DELETE FROM ${tableName} where ${field}='${value}' AND ${field2}='${value2}' `;
    return await this.executeQueryWithObj(query);
};

module.exports.findBytwoFieldname = async (tableName, field1, value1, field2, value2) => {
    const query = `SELECT * from ${tableName} WHERE ${field1}='${value1}' and ${field2}='${value2}' `;
    return await this.executeQuery(query);
};

module.exports.filterbyThreeFields = async (tableName, field1, value1, field2, value2, field3, value3) => {
    // const query = `SELECT * from ${tableName} WHERE ${field1}='${value1}' and ${field2}='${value2}' `;
    const query = `SELECT * from ${tableName} where ${field1} LIKE '%${value1}%' or ${field2} LIKE '%${value2}%' or ${field3} LIKE '%${value3}%';`;
    return await this.executeQuery(query);
};
