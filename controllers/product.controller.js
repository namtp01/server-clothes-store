import Product from "../models/product.model.js";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Category from "../models/category.model.js"
// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = expressAsyncHandler(async (req, res) =>
{
    const { name, price, description, image, countInStock, category } = req.body
    const productExist = await Product.findOne({ name })
    if (productExist) {
        res.status(400)
        throw new Error("Product name already exist")
    } else {
        const product = new Product({
            name, price, description, image, countInStock, color, category,
            user: req.user._id
        })
        if (product) {
            const createdproduct = await product.save()
            res.status(201).json(createdproduct)
        }
    }
})

// @desc    Get all products
// @route   GET /api/products/
// @access  Public
const getAllProducts = expressAsyncHandler(async (req, res) =>
{
    // try {
    //     const pageSize = 6
    //     const page = Number(req.query.pageNumber) || 1
    //     const category = req.query.category
    //     const keyword = req.query.keyword ? {
    //         name: {
    //             $regex: req.query.keyword,
    //             $options: "i"
    //         }
    //     } : {}

    //     const filter = category ? { ...keyword, category } : { ...keyword}
    //     const count = await Product.countDocuments(filter)
    //     const products = await Product.find(filter).limit(pageSize).skip(pageSize * (page - 1))
    //         .sort({ _id: -1 })
    //     res.json({ products, page, pages: Math.ceil(count / pageSize) })
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }

    const { keyword, pageNumber, category } = req.query;

    const page = Number(pageNumber) || 1;
    const pageSize = 10; // Adjust as necessary

    let query = {
        ...(keyword && { name: { $regex: keyword, $options: 'i' } }),
    };

    if (category) {
        try {
            const categoryDoc = await Category.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(404).json({ message: 'Category not found' });
            }
    
            query.category = categoryDoc._id; // Assign ObjectId of the found category
        } catch (error) {
            return res.status(500).json({ message: 'Server Error' });
        }
    }

    try {
        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1)).populate('category', '_id name');

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

// @desc    Admin get all prodcuts without search and pagination
// @route   GET /api/products/all
// @access  Private/Admin
const adminGetAllProducts = expressAsyncHandler(async (req, res) =>
{
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: "i"
        }
    } : {}
    const products = await Product.find({ ...keyword }).sort({ _id: -1 })
    res.json(products)
})

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = expressAsyncHandler(async (req, res) =>
{
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error("Product not found")
    }
})

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = expressAsyncHandler(async (req, res) =>
{
    const { name, price, description, image, countInStock, color, category } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = name || product.name
        product.price = price || product.price
        product.description = description || product.description
        product.image = image || product.image
        product.countInStock = countInStock || product.countInStock
        product.category = category || product.category

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error("Product Not Found")
    }
})

// @desc    Product review
// @route   POST /api/products/:id/review
// @access  Private
const productReview = expressAsyncHandler(async (req, res) =>
{
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        )
        if (alreadyReviewed) {
            res.status(400)
            throw new Error("Product already reviewed")
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(201).json({ message: "Reviewed Added" })
    } else {
        res.status(404)
        throw new Error("Product Not Found")
    }
})

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = expressAsyncHandler(async (req, res) =>
{
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.deleteOne()
        res.json({ message: "Product deleted" })
    } else {
        res.status(404)
        throw new Error("Product Not Found")
    }
})

const createSpu = async (req, res, next) =>
{
    try {
        const spu = await newSpu(req.body)
        new SuccessResponse('Spu created successfully', spu).send(res)
    } catch (error) { }
}

const getProductByCategory = expressAsyncHandler(async (req, res) =>
{
    const category = req.params.category; // Get the category from the request parameters

    const products = await Product.find({ category: category }); // Find products by category

    if (products.length > 0) {
        res.json(products); // If products are found, send them in the response
    } else {
        res.status(404); // If no products are found, send a 404 status code
        throw new Error('No products found for this category');
    }
});

export { createProduct, getAllProducts, adminGetAllProducts, getProductById, updateProduct, productReview, deleteProduct }