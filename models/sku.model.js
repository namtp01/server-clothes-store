import mongoose from "mongoose";
import slugify from "slugify";

const skuSchema = mongoose.Schema({
    sku_id: { type: String, required: true, unique: true },
    sku_tier_idx: { type: Array, default: [0] },
    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: '' },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: Number, required: true },
    sku_stock: { type: Number, default: 0 },
    product_id: { type: String, required: true },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDelected: { type: Boolean, default: false }
}, {
    timestamps: true
})

export default mongoose.model("Sku", productSchema)