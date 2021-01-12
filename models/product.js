// todo: Some queries while using native mysql package
// db.execute('INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)', [this.title, this.imageUrl, this.description, this.price]);
// db.execute('SELECT * FROM products');
// db.execute('SELECT * FROM products WHERE products.id = ?', [id]);

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: { type: Sequelize.DOUBLE, allowNull: false },
  imageUrl: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Product;
