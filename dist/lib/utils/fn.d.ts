export declare const oneSuccess: (promises: Array<Promise<any>>) => Promise<any>;
export declare const hasOwnProperty: (o: any, k: string) => any;
export declare class AggregateError extends Array implements Error {
    name: string;
    get message(): string;
}
