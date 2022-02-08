const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./user.model");
const Products = require("../products/product.model");
const ProductService = require("../products/product.service");

module.exports = {
    authenticate,
    getAll,
    create,
    delete: _delete,
    add_to_cart,
    checkout
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, {
            expiresIn: "7d",
        });
        return {
            ...user.toJSON(),
            token,
        };
    }
}

async function getAll() {
    return await User.find();
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function add_to_cart(id, array_id, product) {
    const user = await User.findById(id);
    UpdatedUser = user;
    if ((await Products.findById(product.id)).quantity < product.quantity) {
        throw "Quantity unavailable";
    }
    ProductService.reduceQuantity(product.id, product.quantity);
    if (user.carts.length > array_id) {
        index = user.carts[array_id].findIndex((x) => x.id === product.id);
        if (index != -1) {
            product.quantity= product.quantity + UpdatedUser.carts[array_id][index].quantity; 
            UpdatedUser.carts[array_id][index] = product;
        } else {
            UpdatedUser.carts[array_id].push(product);
        }
    } else if (user.carts.length == array_id) {
        UpdatedUser.carts.push([product]);
    } else {
        throw "Array_Id too large";
    }
    Object.assign(user, UpdatedUser);
    await user.save();
}

async function checkout(id, array_id) {
    const user = await User.findById(id);
    UpdatedUser = user;
    
    if (user.carts.length > array_id) {
        UpdatedUser.carts[array_id]=[];
    } else {
        throw "Array_Id too large";
    }
    Object.assign(user, UpdatedUser);
    await user.save();
}
