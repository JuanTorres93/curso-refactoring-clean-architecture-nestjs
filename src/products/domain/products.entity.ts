import { ValidationMultipleErrors } from "../../common/domain/errors";
import { SKU } from "./value-objects/sku.value.object";
import { Title } from "./value-objects/title.value.object";

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

type ProductEntityProps = Omit<ProductProps, "sku" | "title"> & {
    sku: SKU;
    title: Title;
};

export class Product {
    public readonly sku: SKU;
    public readonly title: Title;
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
        const [skuError, sku] = this.validateValueObject(SKU.create, data.sku);
        const [titleError, title] = this.validateValueObject(Title.create, data.title);

        const errors = [skuError, titleError].filter(Boolean);

        if (errors.length > 0) {
            throw new ValidationMultipleErrors(errors);
        }

        return new Product({
            ...data,
            sku,
            title,
        });
    }

    toProps(): ProductProps {
        // TODO NEXT: Vídeo 49, minuto 21, acaba de poner el .value aquí abajo en el sku
        return {
            sku: this.sku.value,
            title: this.title.value,
            description: this.description,
            categoryUid: this.categoryUid,
            image: this.image,
            price: this.price,
            createdDate: this.createdDate,
            lastUpdated: this.lastUpdated,
        };
    }

    private static validateValueObject<T>(create: (value: string) => T, value: string): [string, T] {
        try {
            return [null, create(value)];
        } catch (error) {
            return [error.message, null];
        }
    }
}
