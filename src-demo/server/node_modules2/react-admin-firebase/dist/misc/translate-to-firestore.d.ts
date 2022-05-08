interface ParsedUpload {
    fieldDotsPath: string;
    fieldSlashesPath: string;
    rawFile: File | any;
}
interface ParsedDocRef {
    fieldDotsPath: string;
    refPath: string;
}
interface ParseResult {
    parsedDoc: any;
    uploads: ParsedUpload[];
    refdocs: ParsedDocRef[];
}
export declare function translateDocToFirestore(obj: any): ParseResult;
export declare function recusivelyParseObjectValue(input: any, fieldPath: string, result: ParseResult): any;
export {};
