import { ValidationDomainError } from "../../../common/domain/errors";
import { ValueObject } from "./value.object";

export interface ImageProps {
    value: string;
}

const URL_REGEX = /^https?:\/\/.+/i;

export class Image extends ValueObject<ImageProps> {
    public readonly value: string;

    private constructor(props: ImageProps) {
        super(props);
        this.value = props.value;
    }

    public static create(value: string): Image {
        const trimmedValue = value.trim();

        // If not empty, validate URL format
        if (!URL_REGEX.test(trimmedValue)) {
            throw new ValidationDomainError("image must be a URL address");
        }

        return new Image({ value: trimmedValue });
    }
}
