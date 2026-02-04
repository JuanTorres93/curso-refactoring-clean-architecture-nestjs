export class DomainError extends Error {}
export class ResourceNotFoundError extends DomainError {}
export class ValidationDomainError extends DomainError {}
export class ValidationMultipleErrors extends DomainError {
    constructor(public readonly errors: string[]) {
        super();
    }
}
