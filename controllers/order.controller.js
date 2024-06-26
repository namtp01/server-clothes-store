import Order from "../models/order.model.js"
import expressAsyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import sendMail from "./email.controller.js"

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
    const orders = await Order.find({}).sort({ _id: -1 }).populate("user", "id name email")
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

const sendUserOrderByEmail = expressAsyncHandler(async (req, res) =>
{
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const order = await Order.findOne({ user: user._id }).sort({ _id: -1 }); // replace with your actual logic to get the user's order

    if (!order) {
        return res.status(404).send({ message: 'Order not found' });
    }

    // const mailData = {
    //     to: email,
    //     subject: 'Your Order Details',
    //     text: `Here are your order details: ${JSON.stringify(order)}`, // replace with your actual logic to format the order details
    //     html: `<p>Here are your order details: ${JSON.stringify(order)}</p>`, // replace with your actual logic to format the order details
    // };

    const mailData = {
        to: email,
        subject: `Your Order Details ${order.customId}`,
        text: `
      Thanks for your Order, ${user.name}!
      
      Order details:
      * Items:
        ${order.orderItems.map(item => `
          - ${item.name} (Qty: ${item.qty}, Price: ${item.price * item.qty})
        `)}
      * Place Order Date: ${order.createdAt}
      * VAT 10%: ${order.taxPrice}
      * Delivery Charges: ${order.shippingPrice}
      * Total Paid: ${order.totalPrice}
        `, // replace with your actual logic to format the order details
        html: `
        <section class="h-100 gradient-custom">
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-lg-10 col-xl-8">
              <div class="card" style="border-radius: 10px;">
                <div class="card-header px-4 py-5">
                  <h5 class="text-muted mb-0">Thanks for your Order, <span style="color: #a8729a;">${order.user.name}</span>!</h5>
                </div>
                <div class="card-body p-4">
                  ${order.orderItems.map(item => `
                  <div class="card shadow-0 border mb-4">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-2">
                        <img src="${item.image}"
                          class="img-fluid" alt="Phone">
                      </div>
                      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p class="text-muted mb-0">${item.name}</p>
                      </div>
                      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p class="text-muted mb-0 small">Qty: ${item.qty}</p>
                      </div>
                      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                        <p class="text-muted mb-0 small">${item.price}</p>
                      </div>
                    </div>
                    
                  </div>
                </div>
                  `)}
                  
      
                  <div class="d-flex justify-content-between pt-2">
                    <p class="fw-bold mb-0">Order Details</p>
                    // <p class="text-muted mb-0"><span class="fw-bold me-4">Total</span> ${order.totalPrice}</p>
                  </div>
      
      
                  <div class="d-flex justify-content-between">
                    <p class="text-muted mb-0">Place Order Date : ${order.createdAt}</p>
                    <p class="text-muted mb-0"><span class="fw-bold me-4">VAT 10%</span> ${order.taxPrice}</p>
                  </div>
      
                  <div class="d-flex justify-content-between mb-5">
                    <p class="text-muted mb-0">Recepits Voucher : 18KU-62IIK</p>
                    <p class="text-muted mb-0"><span class="fw-bold me-4">Delivery Charges</span> ${order.shippingPrice}</p>
                  </div>
                </div>
                <div class="card-footer border-0 px-4 py-5"
                  style="background-color: #a8729a; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                  <h5 class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">Total
                    paid: <span class="h2 mb-0 ms-2">${order.totalPrice}</span></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        `, // replace with your actual logic to format the order details
    };

    await sendMail(mailData);

    res.send({ message: 'Email sent successfully' });
});

export { createOrder, adminGetAllOrders, getOrderById, getUserOrders, payOrder, orderDelivered, sendUserOrderByEmail }