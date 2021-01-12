const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    edit: req.query.edit,
  });
};

exports.postAddProduct = (req, res) => {
  const { title } = req.body;
  const { description } = req.body;
  const { price } = req.body;
  const { imageUrl } = req.body;

  // Product.create({ title, description, price, imageUrl, userId: req.user.id })
  // or
  req.user.createProduct({ title, description, price, imageUrl })
    .then(() => res.redirect('/'))
    .catch((err) => console.log('Error while saving new product in DB: ', err));
};

exports.getEditProduct = (req, res) => {
  const { edit } = req.query;
  if (!edit) {
    return res.redirect('/');
  }

  // req.user.getProducts({ where: { id: req.params.productId } }) // return an Array
  // or
  Product.findByPk(req.params.productId)
    .then((product) => {
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        edit,
      });
    })
    .catch((err) => console.log('Error while findByPk ADMIN products: ', err));
};

exports.postEditProduct = (req, res) => {
  const { productId } = req.body;
  const { title } = req.body;
  const { description } = req.body;
  const { price } = req.body;
  const { imageUrl } = req.body;

  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log('Error while updating product: ', err));
};

exports.getProducts = (req, res) => {
  // Product.findAll()
  // or
  req.user.getProducts() // find Products for current user
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log('Error while fetchAll ADMIN products: ', err));
};

exports.deleteProduct = (req, res) => {
  Product.findByPk(req.body.productId)
    .then((product) => product.destroy())
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log('Error while destroying product: ', err));
};
