import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product"
        }
    }],
    shippingAddress: {
        phone: { type: String, required: true},
        address: { type: String, required: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "Paypal"
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 10.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }

})

orderSchema.virtual('customId').get(function() {
    const date = new Date(this._id.getTimestamp());
    const dateString = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;

    // Generate a random 6-digit number
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    return `${dateString}${this.user._id}${randomNum}`;
})

export default mongoose.model("Order", orderSchema)
