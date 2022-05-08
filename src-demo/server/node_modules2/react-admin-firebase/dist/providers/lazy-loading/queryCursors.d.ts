import { FireStoreCollectionRef, FireStoreDocumentSnapshot, FireStoreQuery } from 'misc/firebase-models';
import { IFirestoreLogger, messageTypes } from '../../misc';
export declare function setQueryCursor(doc: FireStoreDocumentSnapshot, params: messageTypes.IParamsGetList, resourceName: string): void;
export declare function getQueryCursor(collection: FireStoreCollectionRef, params: messageTypes.IParamsGetList, resourceName: string, flogger: IFirestoreLogger): Promise<FireStoreDocumentSnapshot | false>;
export declare function clearQueryCursors(resourceName: string): void;
export declare function findLastQueryCursor(collection: FireStoreCollectionRef, queryBase: FireStoreQuery, params: messageTypes.IParamsGetList, resourceName: string, flogger: IFirestoreLogger): Promise<import("firebase/compat").default.firestore.QueryDocumentSnapshot<import("firebase/compat").default.firestore.DocumentData>>;
