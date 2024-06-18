import mongoose from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = 'Spu'
const COLLECTION_NAME = 'Spus'

const reviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, {
    timestamps: true,
})

const productSchema = mongoose.Schema({
    product_id: { type: String, default: '' },
    product_name: { type: String, required: true },
    product_description: { type: String, required: true },
    product_slug: String,
    product_reviews: [reviewSchema],
    product_rating: { type: Number, required: true, default: 0 },
    product_numReviews: { type: Number, required: true, default: 0 },
    product_price: { type: Number, required: true, default: 0 },
    product_quantity: { type: Number, required: true, default: 0 },
    product_variations: {
        type: Array,
        default: []
    },
    product_category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Category"
    },
}, {
    timestamps: true
})

//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

export default mongoose.model("Product", productSchema)