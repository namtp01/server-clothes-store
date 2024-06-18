import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, required: true },
    discount_value: { type: Number, required: true },
    discount_max_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    //discount_uses_count: { type: Number, required: true },
    // discount_users_used: { type: Array, required: true },
    discount_max_uses_per_user: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },

    discount_is_active: { type: Boolean, default: true },
    // discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    // discount_product_ids: { type: Array, default: [] },
}, {
    timestamps: true
})

export default mongoose.model("Discount", discountSchema)