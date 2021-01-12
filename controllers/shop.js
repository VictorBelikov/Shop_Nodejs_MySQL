const Product = require('../models/product');

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Index',
        path: '/',
      });
    })
    .catch((err) => console.log('Error while fetchAll products: ', err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
      });
    })
    .catch((err) => console.log('Error while fetchAll products: ', err));
};

exports.getProduct = (req, res) => {
  // Product.findAll({ where: { id: req.params.productId } })
  // or
  Product.findByPk(req.params.productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log('Error while findByPk product: ', err));
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      res.render('shop/cart', {
        prods: products,
        pageTitle: 'Cart',
        path: '/cart',
      });
    })
    .catch((err) => console.log('Error while getting Cart for User: ', err));
};

exports.postCart = (req, res) => {
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: req.body.productId } });
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(req.body.productId);
    })
    .then((product) => fetchedCart.addProduct(product, { through: { quantity: newQuantity } }))
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log('Error while adding product to the Cart: ', err));
};

exports.deleteProductCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: req.body.productId } }))
    .then((products) => products[0].cartItem.destroy())
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log('Error while deleting from the Cart: ', err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        orders,
        pageTitle: 'Orders',
        path: '/orders',
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  let fetchedProducts;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      fetchedProducts = products;
      return req.user.createOrder();
    })
    .then((order) =>
      order.addProducts(
        fetchedProducts.map((p) => {
          p.orderItem = { quantity: p.cartItem.quantity };
          return p;
        }),
      ),
    )
    .then(() => fetchedCart.setProducts(null)) // clear our CartItem
    .then(() => res.redirect('/orders'))
    .catch((err) => console.log(err));
};
