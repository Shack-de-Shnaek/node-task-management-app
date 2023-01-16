export type NestError = {
    statusCode: number;
    message: string?;
    messages: string[]?;
    error: string;
}