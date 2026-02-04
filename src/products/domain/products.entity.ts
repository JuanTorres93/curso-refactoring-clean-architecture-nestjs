import { ValidationMultipleErrors } from "../../common/domain/errors";
import { SKU } from "./value-objects/sku.value.object";
import { Title } from "./value-objects/title.value.object";
import { Description } from "./value-objects/description.value.object";
import { Image } from "./value-objects/image.value.object";
import { Price } from "./value-objects/price.value.object";

export type ProductProps = {
    sku: string;
    title: string;
    description?: string;
    categoryUid: string;
    image: string;
    price: number;
    createdDate: Date;
    lastUpdated: Date;
};

type ProductEntityProps = Omit<ProductProps, "sku" | "title" | "description" | "image" | "price"> & {
    sku: SKU;
    title: Title;
    description?: Description;
    image?: Image;
    price: Price;
};

export class Product {
    public readonly sku: SKU;
    public readonly title: Title;
    public readonly description?: Description;
    public readonly categoryUid: string;
    public readonly image?: Image;
    public readonly price: Price;
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
        const [skuError, sku] = this.validateValueObject(SKU.create, data.sku);
        const [titleError, title] = this.validateValueObject(Title.create, data.title);
        const [descriptionError, description] =
            data.description !== undefined
                ? this.validateValueObject(Description.create, data.description)
                : [null, undefined];
        const [imageError, image] =
            data.image !== undefined ? this.validateValueObject(Image.create, data.image) : [null, undefined];
        const [priceError, price] = this.validateValueObject(Price.create, data.price);

        const errors = [skuError, titleError, descriptionError, imageError, priceError].filter(Boolean);

        if (errors.length > 0) {
            throw new ValidationMultipleErrors(errors);
        }

        return new Product({
            ...data,
            sku,
            title,
            description,
            image,
            price,
        });
    }

    toProps(): ProductProps {
        return {
            sku: this.sku.value,
            title: this.title.value,
            description: this.description.value,
            categoryUid: this.categoryUid,
            image: this.image.value,
            price: this.price.value,
            createdDate: this.createdDate,
            lastUpdated: this.lastUpdated,
        };
    }

    private static validateValueObject<T>(create: (value: unknown) => T, value: unknown): [string, T] {
        try {
            return [null, create(value)];
        } catch (error) {
            return [error.message, null];
        }
    }
}
