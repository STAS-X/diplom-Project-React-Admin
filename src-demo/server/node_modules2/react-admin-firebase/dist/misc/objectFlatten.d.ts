declare type SearchValues = {} | number | string | boolean | null;
declare type SearchValue = SearchValues | SearchValue[];
export interface SearchObj {
    searchField: string;
    searchValue: SearchValue;
}
export declare function getFieldReferences(fieldName: string, value: {} | SearchValue): SearchObj[];
export declare function objectFlatten(tree: {}): SearchObj[];
export {};
