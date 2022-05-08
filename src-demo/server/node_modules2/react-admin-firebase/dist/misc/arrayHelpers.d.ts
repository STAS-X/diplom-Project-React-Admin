export declare function sortArray(data: Array<{}>, field: string, dir: 'asc' | 'desc'): void;
export declare function filterArray(data: Array<{}>, searchFields?: {
    [field: string]: string | number | boolean | null;
}): Array<{}>;
export declare function doesRowMatch(row: {}, searchField: string, searchValue: any): boolean;
