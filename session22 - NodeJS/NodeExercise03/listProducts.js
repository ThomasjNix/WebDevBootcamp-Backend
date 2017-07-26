// Require faker
var faker = require('faker');

//Create Product object with properties
var Product = {
    productName : '',
    productPrice : ''
};

//Initialize a product array
var productArr = [];

//Create 10 new instances of the object prototyped to the Product object
//Add random names and prices to the objects
for (var i = 0; i < 10; i++){
    var newProd = Object.create(Product);
    newProd.productName = faker.commerce.productName();
    newProd.productPrice = faker.commerce.price();
    productArr.push(newProd);
}

console.log('====='+"\nShop:\n"+"=====");

//Loop through the object array and print each product name and price
productArr.forEach(function(product){
    console.log(product.productName + ": $" + product.productPrice);
});