import { FireStoreCollectionRef, FireStoreQuery } from 'misc/firebase-models';
import { IFirestoreLogger, messageTypes } from '../../misc';
interface ParamsToQueryOptions {
    filters?: boolean;
    sort?: boolean;
    pagination?: boolean;
}
export declare function paramsToQuery<TParams extends messageTypes.IParamsGetList>(collection: FireStoreCollectionRef, params: TParams, resourceName: string, flogger: IFirestoreLogger, options?: ParamsToQueryOptions): Promise<FireStoreQuery>;
export declare function filtersToQuery(query: FireStoreQuery, filters: {
    [fieldName: string]: any;
}): FireStoreQuery;
export declare function sortToQuery(query: FireStoreQuery, sort: {
    field: string;
    order: string;
}): FireStoreQuery;
export declare function getFullParamsForQuery<TParams extends messageTypes.IParamsGetList>(reactAdminParams: TParams, softdeleteEnabled: boolean): TParams;
export declare function getNextPageParams<TParams extends messageTypes.IParamsGetList>(params: TParams): TParams;
export {};
