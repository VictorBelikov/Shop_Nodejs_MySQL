// todo: Connect to DB with native MySQL
// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete-guide',
//   password: '111111',
// });
//
// module.exports = pool.promise();

// Connect to DB using Sequelize
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete-guide', 'root', '111111', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;
