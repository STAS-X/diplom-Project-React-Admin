export declare type DispatchEvent = 'FILE_UPLOAD_WILL_START' | 'FILE_UPLOAD_PROGRESS' | 'FILE_UPLOAD_PAUSED' | 'FILE_UPLOAD_RUNNING' | 'FILE_UPLOAD_CANCELED' | 'FILE_UPLOAD_COMPLETE' | 'FILE_SAVED';
export declare function dispatch(eventName: DispatchEvent, fileName: string, data?: any): void;
