export abstract class ValueObject<T> {
    constructor(protected readonly props: T) {
        this.props = props;
    }

    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }

        if (this.props === undefined) {
            return false;
        }

        return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }
}
