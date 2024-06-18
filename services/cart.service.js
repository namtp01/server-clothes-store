class CartService {

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = { upsert: true, new: true }

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product

        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product = {} }) {
        // check cart if exist
        const userCart = await findOne({ cart_userId: userId })
        if(!userCart) {
            // create cart for user
            return await CartService.createUserCart({ userId, product }) 
        }

        // cart exist , no product
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        
        // cart exist, product exist, update quantity
        return await CartService.updateUserCartQuantity({userId, product })
    }

    static async addToCartV2({ userId, product = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        //check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new Error('Product not found')
    }
}