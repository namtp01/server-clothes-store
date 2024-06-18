import Discount from '../models/discount.model'

class DiscountService
{
    static async createDiscountCode (payload)
    {
        const { code, start_date, end_date, is_active, min_order_value,
            product_ids, applies_to, name, description, type, value, max_value,
            max_uses, uses_count, max_uses_per_user, users_used
        } = payload

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            return { error: "Invalid start or end date", status: 400 }
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return { error: "Start date must be before end date", status: 400 }
        }

        const foundDiscount = await Discount.findOne({
            discount_code: code,
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            return { error: "Discount exists", status: 400 }
        }

        const newDiscount = await Discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,

            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })

        return newDiscount
    }

    static async updateDiscountCode () {

    }

    static async getAllDiscountCodesWithProduct ({
        code, userId, limit, page
    }) {
        const foundDiscount = await Discount.findOne({
            discount_code: code,
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            return { error: "Discount not found", status: 404 }
        }
    }
}