import { ValidationDomainError } from "../../../common/domain/errors";
import { ValueObject } from "./value.object";

export interface SKUProps {
    value: string;
}

const skuRegex = /^[a-zA-Z0-9]{3}_[a-zA-Z0-9]{3}_[a-zA-Z0-9]{2}$/;

export class SKU extends ValueObject<SKUProps> {
    public readonly value: string;

    private constructor(props: SKUProps) {
        super(props);
        this.value = props.value;
    }

    public static create(value: string): SKU {
        if (!value || value.trim() === "") {
            throw new ValidationDomainError("sku should not be empty");
        }

        if (!skuRegex.test(value)) {
            throw new ValidationDomainError("Invalid SKU format (must be ###_###_##)");
        }

        return new SKU({ value: value.trim() });
    }
}
