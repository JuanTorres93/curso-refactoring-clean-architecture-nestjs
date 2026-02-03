type ProductProps = {
    sku: string;
    title: string;
    description: string;
    categoryUid: string;
    image: string;
    price: number;
    createdDate: Date;
    lastUpdated: Date;
};

export class Product {
    public readonly sku: string;
    public readonly title: string;
    public readonly description: string;
    public readonly categoryUid: string;
    public readonly image: string;
    public readonly price: number;
    public readonly createdDate: Date;
    public readonly lastUpdated: Date;

    constructor(props: ProductProps) {
        this.sku = props.sku;
        this.title = props.title;
        this.description = props.description;
        this.categoryUid = props.categoryUid;
        this.image = props.image;
        this.price = props.price;
        this.createdDate = props.createdDate;
        this.lastUpdated = props.lastUpdated;
    }
}
