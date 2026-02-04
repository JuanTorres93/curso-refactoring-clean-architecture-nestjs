import { ValidationDomainError } from "../../../common/domain/errors";
import { ValueObject } from "./value.object";

export interface DescriptionProps {
    value: string;
}

export class Description extends ValueObject<DescriptionProps> {
    public readonly value: string;

    private constructor(props: DescriptionProps) {
        super(props);
        this.value = props.value;
    }

    public static create(value: string): Description {
        const trimmedValue = value.trim();

        if (trimmedValue.length > 10000) {
            throw new ValidationDomainError("description must not exceed 10000 characters");
        }

        return new Description({ value: trimmedValue });
    }
}
