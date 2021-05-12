const express = require('express');
const router = express.Router();
const faker = require("faker");
const Product = require("../models/product");

router.get("/products", (req, res, next) => {
  const perPage = 9;
  const page = req.query.page || 1;

  if (req.query.category && req.query.price == 'lowest') {
    console.log(req.query.category);
    console.log(req.query.price);
    Product
      .find({ category: { $eq: req.query.category } })
      .sort({ price: 1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, products) => {
        Product.count().exec((err, count) => {
          if (err) return next(err);

          res.send(products);
        });
      });
  }

  if (req.query.category && req.query.price == 'highest') {
    console.log(req.query.category);
    console.log(req.query.price);
    Product
      .find({ category: { $eq: req.query.category } })
      .sort({ price: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, products) => {
        Product.count().exec((err, count) => {
          if (err) return next(err);

          res.send(products);
        });
      });
  }

  else {
    Product
      .find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, products) => {
        Product.count().exec((err, count) => {
          if (err) return next(err);

          res.send(products);
        });
      });
  }

});

router.get("/products/:product", (req, res) => {
  Product.findById(req.params.product)
    .then(productFound => {
      if (!productFound) { return res.status(404).end(); }
      return res.status(200).json(productFound);
    })
    .catch(err => next(err))
});

router.post("/products", (req, res) => {
  Product.create(req.body, function (err, product) {
    if (err) {
      return res.status(401);
    }
    res.status(200).json(product);
  })
});

// router.post("/products/:product/reviews", (req, res) => {
//   Product.findById(req.params.product)
//   Product.reviews.create(req.body, function (err, review) {
//     if (err) {
//       return res.status(401);
//     }
//     res.status(200).json(review);
//   })
// });

router.delete("/products/:product", (req, res) => {
  Product.findByIdAndRemove(req.params.product)
    .then(productFound => {
      if (!productFound) { return res.status(404).end(); }
      return res.status(200).json(productFound);
    })
    .catch(err => next(err))
});

module.exports = router;


// router.get("/generate-fake-data", (req, res, next) => {
//   for (let i = 0; i < 90; i++) {
//     let product = new Product();
//     product.category = faker.commerce.department();
//     product.name = faker.commerce.productName();
//     product.price = faker.commerce.price();
//     product.image = "https://via.placeholder.com/250?text=Product+Image";
//     product.save((err) => {
//       if (err) throw err;
//     });
//   }
//   res.end();
// })