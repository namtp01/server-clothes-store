import SKU_MODEL from '../models/sku.model.js';
import { randomProductId } from '../utils/randomProductId.js';

const newSku = async({ spu_id, sku_list }) => {
    try {
        const convert_sku_list = sku_list.map( sku => {
            return {...sku, product_id: spu_id, sku_id: `${spu_id}.${randomProductId()}`}
        })
        const skus = await SKU_MODEL.create(convert_sku_list)
        return skus
    } catch (error) {
        return []
    }
}

export default { newSku }