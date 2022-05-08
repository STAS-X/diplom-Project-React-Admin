declare type LogFn = (...args: any) => void;
export declare const LogNoOp: LogFn;
export declare class LoggerBase {
    private title;
    private cacheEnabledKey;
    constructor(title: string, cacheEnabledKey: string);
    private isEnabled;
    SetEnabled(isEnabled: boolean): void;
    get log(): LogFn;
    get warn(): LogFn;
    get error(): LogFn;
}
export {};
