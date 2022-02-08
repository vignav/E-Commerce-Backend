const config = require("../config.json");
const Product = require("./product.model");

module.exports = {
    getAll,
    getByName,
    create,
    delete: _delete,
    reduceQuantity
};

async function getAll() {
    return await Product.find();
}

async function getByName(product_name) {
    return await Product.find({ name: product_name });
}

async function getById(id) {
    return await Product.findById(id);
}

async function reduceQuantity(id, reduce_quantity) {
    const product = await Product.findById(id);
    const Finalquantity = product.quantity - reduce_quantity;
    Object.assign(product, {quantity: Finalquantity});
    console.log("yes");
    await product.save();
}

async function create(product) {
    // validate
    if (await Product.findOne({ name: product.name })) {
        throw 'Product "' + product.name + '" is already exists';
    }

    const new_product = new Product(product);

    // save product
    await new_product.save();
}

async function _delete(product_name) {
    await Product.findOne({ name: product_name });
}
