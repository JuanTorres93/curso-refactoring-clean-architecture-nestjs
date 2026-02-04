import { ValidationMultipleErrors } from "../../common/domain/errors";
import { SKU } from "./value-objects/sku.value.object";

export type ProductProps = {
    sku: string;
    title: string;
    description: string;
    categoryUid: string;
    image: string;
    price: number;
    createdDate: Date;
    lastUpdated: Date;
};

type ProductEntityProps = Omit<ProductProps, "sku"> & {
    sku: SKU;
};

export class Product {
    public readonly sku: SKU;
    public readonly title: string;
    public readonly description: string;
    public readonly categoryUid: string;
    public readonly image: string;
    public readonly price: number;
    public readonly createdDate: Date;
    public readonly lastUpdated: Date;

    private constructor(props: ProductEntityProps) {
        this.sku = props.sku;
        this.title = props.title;
        this.description = props.description;
        this.categoryUid = props.categoryUid;
        this.image = props.image;
        this.price = props.price;
        this.createdDate = props.createdDate;
        this.lastUpdated = props.lastUpdated;
    }

    public static create(data: ProductProps): Product {
        const [skuError, sku] = this.validateSku(data.sku);

        if (skuError) {
            throw new ValidationMultipleErrors([skuError]);
        }

        return new Product({
            ...data,
            sku,
        });
    }

    toProps(): ProductProps {
        // TODO NEXT: Vídeo 49, minuto 21, acaba de poner el .value aquí abajo en el sku
        return {
            sku: this.sku.value,
            title: this.title,
            description: this.description,
            categoryUid: this.categoryUid,
            image: this.image,
            price: this.price,
            createdDate: this.createdDate,
            lastUpdated: this.lastUpdated,
        };
    }

    private static validateSku(sku: string): [string, SKU] {
        try {
            return [null, SKU.create(sku)];
        } catch (error) {
            return [error.message, null];
        }
    }
}
