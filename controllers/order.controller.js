import Order from "../models/order.model.js"
import expressAsyncHandler from "express-async-handler"

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = expressAsyncHandler(async (req, res) =>
{
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error("No order items")
    } else {
        const order = new Order({
            orderItems, user: req.user._id, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice
        })
        const createOrder = await order.save()
        res.status(201).json(createOrder)
    }
})

// @desc    Admin get all orders
// @route   GET /api/orders/all
// @access  Private/Admin
const adminGetAllOrders = expressAsyncHandler(async (req, res) =>
{
    const orders = await Order.find({ }).sort({ _id: -1 }).populate("user", "id name email")
    res.json(orders)
})

// const adminGetAllOrders = expressAsyncHandler(async (req, res) => {
//     const page = Number(req.query.pageNumber) || 1
//     const pageSize = Number(req.query.pageSize) || 10
//     const keyword = req.query.keyword ? {
//         _id: { $regex: req.query.keyword, $options: "i" }
//     } : {}

//     const count = await Order.countDocuments({ ...keyword})
//     const orders = await Order.find({ ...keyword})
//         .sort({ _id: -1 })
//         .populate("user", "id name email")
//         .limit(pageSize)
//         .skip(pageSize * (page - 1))

//     res.json({ orders, page, pages: Math.ceil(count / pageSize) })
// })

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = expressAsyncHandler(async (req, res) =>
{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )
    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error("Order Not Found")
    }
})

// @desc    User get orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = expressAsyncHandler(async (req, res) =>
{
    const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 })
    res.json(orders)
})

// @desc    Paying order
// @route   PUT /api/orders/:id/pay
// @access  Private
const payOrder = expressAsyncHandler(async (req, res) =>
{
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error("Order Not Found")
    }
})

// @desc    Order delivered
// @route   PUT /api/orders/:id/delivered
// @access  Private
const orderDelivered = expressAsyncHandler(async (req, res) =>
{
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error("Order Not Found")
    }
})

export { createOrder, adminGetAllOrders, getOrderById, getUserOrders, payOrder, orderDelivered }