const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const err404Controller = require('./controllers/404');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
app.set('view engine', 'ejs'); // Set our template engine
app.set('views', 'views'); // Указываем папку, где лежат наши вьюхи

// Парсит body запросов из JSON строки в Object, чтобы иметь доступ через req.body.someparam
app.use(bodyParser.urlencoded({ extended: false }));

// Public available for 'public' directory
app.use(express.static('public'));

// Make User available everywhere in our application
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(err404Controller.get404);

// Set MySQL DB relations
User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); // One user can create a specific product
Product.belongsToMany(Cart, { through: CartItem });
Product.belongsToMany(Order, { through: OrderItem });

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

module.exports = app;
