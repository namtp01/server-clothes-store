import SPU_MODEL from '../models/spu.model.js';
import { randomProductId } from '../utils/randomProductId.js';
import { newSku } from './sku.service.js';

const newSpu = async ({
    product_id,
    product_name,
    product_description,
    product_price,
    product_category,
    product_quantity,
    product_variations,
    sku_list     = []
}) =>
{
    try {
        // 1. create a new spu
        const spu = await SPU_MODEL.create({
            product_id: randomProductId(),
            product_name,
            product_description,
            product_price,
            product_category,
            product_quantity,
            product_variations,
        })

        // get spu_id add to sku.service
        if (spu && sku_lists.length) {
            newSku({ sku_list, spu_id: spu.product_id})
            .then()
        }

        // sync data via elasticsearch (serch.service)
        return !!spu
    } catch (error) { }
}