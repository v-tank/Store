// import db and faker package
const db = require('../models');
var faker = require('faker');

// export functions that handle tasks based on routes that are hit
module.exports = {
	// function to add a product that's sent from the frontend through the req.body
	add: function(req, res) {
		// console.log(req.body);

		// create a doc in db using the sent object
		db.Product.create(req.body)
			.then(addedProduct => {
				// send back created product to frontend for confirmation as JSON object
				res.json(addedProduct);
			})
			.catch(err => {
				// log errors if any
				console.log(err);
			});
	},
	// function to find all objects in database and return the first 100 in the collection
	findAll: function(req, res) {
		db.Product.find({}).limit(100).then(products => {
				res.json(products); // send back an array of objects with the first 100 products in the db
		});
	},
	// function to find and return a product by its ID
	findById: function(req, res) {
		db.Product.find({_id: req.params.id}).then(foundProduct => {
			res.json(foundProduct);
		})
	},
	// function to remove a document from the db
	remove: function(req, res) {
		db.Product.remove({_id: req.params.id}).then(deleted => {
			res.json(deleted); // send back the deleted doc from the db
		})
	},
	// function that searches for entered text in the search box. The query is sent as a URL parameter, thus we can access it using req.params.query.
	search: function(req, res) {
		// console.log(`Searching for ${req.params.query}...`);

		// the following query searches for entered text, scores the responses based on a match %, sorts in descending order, and returns the results as an array of JSON objects
		db.Product.find({$text: {$search: `"${req.params.query}"`}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).then(products => {
			res.json(products);
		});
	},
	// route to seed the database using the Faker package
	seed: function(req, res) {
		console.log("Seeding...");
		var max = 200;

		for(let i = 0; i < max; i++) {
			let productName = faker.commerce.productName();
			let department = faker.commerce.department();
			let price = faker.commerce.price();
			let imgURL = faker.image.imageUrl();

			// create object to send to db
			var obj = {
				productName: productName,
				department: department,
				imgURL: imgURL,
				price: parseInt(price)
			}

			console.log(obj);

			db.Product.create(obj)
				.then(addedProduct => {
					// console.log(addedProduct)
				})
				.catch(err => {
					console.log(err);
				});

			if (i === max - 1) {
				res.json({"status": "OK"});
			}
		}
		console.log("Done.");
	},
	// function to update a doc in the database based on an ID and an object sent via the req.body
	update: function(req, res) {
		db.Product.update(
			{_id: req.params.id},
			{$set: req.body}
		).then(updatedProduct => {
			res.json(updatedProduct); // returns the updated doc as JSON to frontend
		})
	}
}
