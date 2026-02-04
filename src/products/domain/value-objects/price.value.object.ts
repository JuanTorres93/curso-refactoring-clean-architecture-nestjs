import { ValidationDomainError } from "../../../common/domain/errors";
import { ValueObject } from "./value.object";

export interface PriceProps {
    value: number;
}

export class Price extends ValueObject<PriceProps> {
    public readonly value: number;

    private constructor(props: PriceProps) {
        super(props);
        this.value = props.value;
    }

    public static create(value: number): Price {
        if (value === null || value === undefined) {
            throw new ValidationDomainError("price is required");
        }

        if (typeof value !== "number" || isNaN(value)) {
            throw new ValidationDomainError("price must be a valid number");
        }

        if (value < 0) {
            throw new ValidationDomainError("price must not be less than 0");
        }

        if (value > 9999.99) {
            throw new ValidationDomainError("price must not exceed 9999.99");
        }

        // Check for maximum 2 decimal places
        const decimalPlaces = (value.toString().split(".")[1] || "").length;
        if (decimalPlaces > 2) {
            throw new ValidationDomainError("price must have a maximum of 2 decimal places");
        }

        return new Price({ value });
    }
}
