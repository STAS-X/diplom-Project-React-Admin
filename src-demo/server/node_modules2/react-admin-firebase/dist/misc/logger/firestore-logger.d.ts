import { RAFirebaseOptions } from 'providers/options';
export interface IFirestoreLogger {
    logDocument: (count: number) => Function;
    SetEnabled: (isEnabled: boolean) => void;
    ResetCount: (shouldReset: boolean) => void;
}
export declare function MakeFirestoreLogger(options: RAFirebaseOptions): IFirestoreLogger;
