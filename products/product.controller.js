const express = require("express");
const router = express.Router();
const userService = require("../users/user.service");
const productService = require("./product.service");

// routes
router.get("/", getAll);
router.get("/name/:product_name", getByName);
router.get("/id/:productId", getById);
router.get("/:productTag", getByTag);
router.delete("/:productId", _delete);
router.post("/", create);

module.exports = router;

function getAll(req, res, next) {
    productService
        .getAll()
        .then((products) => res.json(products))
        .catch((err) => next(err));
}

function create(req, res, next) {
    userService
        .getById(req.user.sub)
        .then((user) => {
            if (user) {
                if (user.admin == true) {
                    productService.create(req.body);
                    res.json({});
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err) => next(err));
}

function getByName(req, res, next) {
    productService
        .getByName(req.params.product_name)
        .then((product) => (product ? res.json(product) : res.sendStatus(404)))
        .catch((err) => next(err));
}

function getById(req, res, next) {
    productService
        .getByName(req.params.productId)
        .then((product) => (product ? res.json(product) : res.sendStatus(404)))
        .catch((err) => next(err));
}


function getByTag(req, res, next) {
    productService
        .getByTag(req.params.productTag)
        .then((products) =>{
            console.log(products);
            products ? res.json(products) : res.sendStatus(404);
        })
        .catch((err) => next(err));
}

function _delete(req, res, next) {
    userService
        .getById(req.user.sub)
        .then((user) => {
            if (user) {
                if (user.admin == true) {
                    productService.delete(req.params.productId);
                    res.json({});
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err) => next(err));
}
