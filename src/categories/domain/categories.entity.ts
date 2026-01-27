type categoryProps = {
    categoryUid: string;
    name: string;
};

export class Category {
    public readonly categoryUid: string;
    public readonly name: string;

    constructor(props: categoryProps) {
        this.categoryUid = props.categoryUid;
        this.name = props.name;
    }
}
