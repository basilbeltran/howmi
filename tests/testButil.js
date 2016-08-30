var butil = require('../lib/butil');

bu = new butil;


var articles = [{
              "id": 1,
              "name": "vacuum cleaner",
              "weight": 9.9,
              "price": 89.9,
              "brand_id": 2
          }, {
              "id": 2,
              "name": "washing machine",
              "weight": 540,
              "price": 230,
              "brand_id": 1
          }, {
              "id": 3,
              "name": "hair dryer",
              "weight": 1.2,
              "price": 24.99,
              "brand_id": 2
          }, {
              "id": 4,
              "name": "super fast laptop",
              "weight": 400,
              "price": 899.9,
              "brand_id": 3
          }]


var brands = [{
              "id": 1,
              "name": "SuperKitchen"
          }, {
              "id": 2,
              "name": "HomeSweetHome"
          }]

var result = bu.join(brands, articles, "id", "brand_id", function(article, brand) {
    return {
        id: article.id,
        name: article.name,
        weight: article.weight,
        price: article.price,
        brand: (brand !== undefined) ? brand.name : null
    };
});
console.log(result);
