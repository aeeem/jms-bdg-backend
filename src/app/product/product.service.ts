import { Product } from "@entity/product";

export const getAllProductsService = async () => {
    try {
        return await Product.find();
    } catch (e) {
        console.error(e);
    }
}

export const createProductService = async ({ name} : { name: string }) => {
    try {
        const _newProduct = new Product();
        _newProduct['name'] = name;
        await _newProduct.save();
        return await Product.findOne({
            where: { name: name }
        });
    } catch (e) {
        console.error(e);
    }
}

export const updateProductService = async({ id, name }: { id: number, name: string }) => {
    try {
        const _updatedProduct = await Product.findOne({ where: { id } });
        if (!_updatedProduct) return { message: "Product is not found!" };
        _updatedProduct['name'] = name;
        await _updatedProduct.save();
        return await Product.findOne({
            where: { id: id }
        });
    } catch (e) {
        console.error(e);
    }
}

export const deleteProductService = async({ id }: { id: number }) => {
    try {
        const _deletedProduct = await Product.findOne({ where: { id } });
        if (!_deletedProduct) return { message: "Product is not found!" };
        await _deletedProduct.remove();
        return { message: "Product is deleted!" };
    } catch (e) {
        console.error(e);
    }
}