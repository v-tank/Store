const router = require("express").Router();
const productsController = require('../../controllers/productsController');

// "/api/product"
router.route("/")
  .get(productsController.findAll)
	.post(productsController.add);

// "/api/product/seed"
router.route("/seed")
	.get(productsController.seed);

// "/api/product/:id"
router.route("/:id")
  .delete(productsController.remove)
	.get(productsController.findById)
	.put(productsController.update);

// "/api/product/search/:query"
router.route("/search/:query")
	.post(productsController.search);

module.exports = router;
