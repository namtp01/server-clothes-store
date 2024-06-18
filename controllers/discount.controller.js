import Product from '../models/product.model.js';
import expressAsyncHandler from 'express-async-handler';
import Discount from '../models/discount.model.js';

const createDiscount = expressAsyncHandler(async (req, res) =>
{
    try {
        const { name, description, type, value, max_value, code, start_date, 
            end_date, max_uses, max_uses_per_user, min_order_value, is_active
        } = req.body

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            res.status(400)
            throw new Error("Invalid start or end date")
        }

        if (new Date(start_date) >= new Date(end_date)) {
            res.status(400)
            throw new Error("Start date must be before end date")
        }

        const foundDiscount = await Discount.findOne({
            discount_code: code,
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            res.status(400)
            throw new Error("Discount exists")
        }

        const newDiscount = new Discount({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            // discount_uses_count: uses_count,
            // discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            

            discount_is_active: is_active,
            // discount_applies_to: applies_to,
            // discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })

        if (newDiscount) {
            const createdDiscount = await newDiscount.save()
            res.status(201).json(createdDiscount)
        } else {
            res.status(404)
            throw new Error("Invalid discount data")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const updateDiscount = expressAsyncHandler(async (req, res) =>
{
    const { name, description, type, value, max_value, code, start_date, 
        end_date, max_uses, max_uses_per_user, min_order_value, is_active
    } = req.body

    try {
        const discount = await Discount.findById(req.params.id)
        if (discount) {
            discount.discount_name = name || discount.discount_name
            discount.discount_description = description || discount.discount_description
            discount.discount_type = type || discount.discount_type
            discount.discount_value = value || discount.discount_value
            discount.discount_max_value = max_value || discount.discount_max_value
            discount.discount_code = code || discount.discount_code
            discount.discount_start_date = new Date(start_date) || discount.discount_start_date
            discount.discount_end_date = new Date(end_date) || discount.discount_end_date
            discount.discount_max_uses = max_uses || discount.discount_max_uses
            // discount.discount_uses_count = uses_count || discount.discount_uses_count
            // discount.discount_users_used = users_used || discount.discount_users_used
            discount.discount_max_uses_per_user = max_uses_per_user || discount.discount_max_uses_per_user
            discount.discount_min_order_value = min_order_value || discount.discount_min_order_value

            discount.discount_is_active = is_active || discount.discount_is_active
            discount.discount_applies_to = applies_to || discount.discount_applies_to
            discount.discount_product_ids = applies_to === 'all' ? [] : product_ids || discount.discount_product_ids

            const updatedDiscount = await discount.save()
            res.json(updatedDiscount)
        } else {
            res.status(404)
            throw new Error("Product Not Found")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getAllDiscounts = expressAsyncHandler(async (req, res) => {
    try {
        const discounts = await Discount.find({})
        res.json(discounts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getAllDiscountCodeWithProduct = expressAsyncHandler(async (req, res) =>
{
    const { code } = req.body
    const foundDiscount = await Discount.findOne({
        discount_code: code,
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
        res.status(400)
        throw new Error("Discount not exists")
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    if (discount_applies_to === 'all') {
        products = await getAllProducts({
            select: ['product_name']
        })
    }

    if (discount_applies_to === 'specific') {
        products = await getAllProducts({
            filters: {
                _id: { $in: discount_product_ids }
            },
            select: ['product_name']
        })
    }

    res.status(200).json(products)
})

const getDiscountById = expressAsyncHandler(async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id)
        if (discount) {
            res.json(discount)
        } else {
            res.status(404)
            throw new Error("Discount not found")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const deleteDiscount = expressAsyncHandler(async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id)
        if (discount) {
            await discount.remove()
            res.json({ message: "Discount removed" })
        } else {
            res.status(404)
            throw new Error("Discount not found")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export { createDiscount, updateDiscount, getAllDiscounts, getAllDiscountCodeWithProduct, deleteDiscount, getDiscountById}