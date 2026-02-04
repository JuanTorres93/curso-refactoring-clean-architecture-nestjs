import { ValidationDomainError } from "../../../common/domain/errors";
import { ValueObject } from "./value.object";

export interface TitleProps {
    value: string;
}

export class Title extends ValueObject<TitleProps> {
    public readonly value: string;

    private constructor(props: TitleProps) {
        super(props);
        this.value = props.value;
    }

    public static create(value: string): Title {
        if (!value || value.trim() === "") {
            throw new ValidationDomainError("title should not be empty");
        }

        const trimmedValue = value.trim();

        if (trimmedValue.length < 3) {
            throw new ValidationDomainError("title must be at least 3 characters long");
        }

        if (trimmedValue.length > 255) {
            throw new ValidationDomainError("title must not exceed 255 characters");
        }

        return new Title({ value: trimmedValue });
    }
}
