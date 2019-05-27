const mongoose = require('mongoose');

const Product = mongoose.model('Product');

module.exports = {
    async list(req, res){
        const products = await Product.find();
        return res.json(products)
    },

    async create(req, res){
        const product = await Product.create(req.body);

        return res.json(product);
    },

    async find(req, res){
        const product = await Product.findOne(req.params.id);

        return res.json(product);
    },

    async update(req, res){
        const product = await Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});

        return res.json(product);
    },

    async delete(req, res){
        await Product.findOneAndRemove(req.params.id);

        return res.json(true);
    },





}