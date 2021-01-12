const http = require('http');
const sequelize = require('./util/database');

const app = require('./app');

const User = require('./models/user');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Convert our sequelize models to real tables in MySQL db.
sequelize
  .sync({ force: false })
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: 'AdminUser', email: 'adminuser1.@example.com' });
    }
    return user; // 'then' automatically wrap everything into a new Promise
  })
  .then((user) =>
    user
      .getCart()
      .then((cart) => {
        if (!cart) {
          return user.createCart();
        }
        return cart;
      })
      .catch((err) => console.log(err)),
  )
  .then(() => server.listen(port, () => console.log(`Server is listening on port ${port} ...`)))
  .catch((err) => console.log('ERROR while converting sequelize models to MySQL tables: ', err));

// ========================= Create server more simple way ==============================
// app.listen(3000, () => console.log('Server is running on port 3000...'));

// Express source code:
// app.listen = function() {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };
