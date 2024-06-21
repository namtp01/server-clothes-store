import Category from '../models/category.model.js'
import expressAsyncHandler from 'express-async-handler'

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = expressAsyncHandler(async (req, res) =>
{
    try {
        const { name, image, parent } = req.body
        const categoryExist = await Category.findOne({ name })
        if (categoryExist) {
            res.status(400)
            throw new Error("Category name already exist")
        } else {
            const category = new Category({
                name, image, parent
            })
            if (category) {
                const createdCategory = await category.save()
                res.status(201).json(createdCategory)
            } else {
                res.status(404)
                throw new Error("Invalid category data")
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = expressAsyncHandler(async (req, res) =>
{
    const categories = await Category.find({});
    res.json(categories);
})

// @desc    Get single category by id
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = expressAsyncHandler(async (req, res) =>
{
    const category = await Category.findById(req.params.id);

    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error("Category Not Found");
    }
})

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = expressAsyncHandler(async (req, res) =>
{
    const category = await Category.findById(req.params.id)
    const { name, image, parent } = req.body
    if (category) {
        category.name = name || category.name
        category.image = image || category.image
        category.parent = parent || category.parent

        const updatedCategory = await category.save()
        res.json(updatedCategory)

    } else {
        res.status(404)
        throw new Error("Category Not Found")
    }
})

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = expressAsyncHandler(async (req, res) =>
{
    const category = await Category.findById(req.params.id)
    if (category) {
        await category.deleteOne()
        res.json({ message: "Category deleted" })

    } else {
        res.status(404)
        throw new Error("Category Not Found")
    }
})

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory }

