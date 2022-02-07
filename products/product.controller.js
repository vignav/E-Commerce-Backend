const express = require("express");
const router = express.Router();
const userService = require("../users/user.service");
const productService = require("./product.service");

// routes
router.get("/", getAll);
router.get("/:product_name", getByName);
router.delete("/:product_name", _delete);
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
            if (user){
                if(user.admin==true){
                    productService.create(req.body);
                    res.json({});
                }else{
                    res.sendStatus(403);
                }
            }
            else{
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

function _delete(req, res, next) {
    userService
        .getById(req.user.sub)
        .then((user) => {
            if (user){
                if(user.admin==true){
                    productService.delete(req.params.product_name);
                    res.json({});
                }else{
                    res.sendStatus(403);
                }
            }
            else{
                res.sendStatus(404);   
            }
        })
        .catch((err) => next(err));
}
