import { IFirebaseWrapper } from './IFirebaseWrapper';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { RAFirebaseOptions } from 'providers/options';
import { FireApp, FireAuth, FireAuthUserCredentials, FireStorage, FireStoragePutFileResult, FireStore, FireStoreBatch, FireStoreCollectionRef, FireUser } from 'misc/firebase-models';
export declare class FirebaseWrapper implements IFirebaseWrapper {
    private firestore;
    private app;
    options: RAFirebaseOptions;
    constructor(inputOptions: RAFirebaseOptions | undefined, firebaseConfig: {});
    dbGetCollection(absolutePath: string): FireStoreCollectionRef;
    dbCreateBatch(): FireStoreBatch;
    dbMakeNewId(): string;
    OnUserLogout(callBack: (u: FireUser | null) => any): void;
    putFile(storagePath: string, rawFile: any): FireStoragePutFileResult;
    getStorageDownloadUrl(fieldSrc: string): Promise<string>;
    serverTimestamp(): firebase.firestore.FieldValue;
    authSetPersistence(persistenceInput: 'session' | 'local' | 'none'): Promise<void>;
    authSigninEmailPassword(email: string, password: string): Promise<FireAuthUserCredentials>;
    authSignOut(): Promise<void>;
    authGetUserLoggedIn(): Promise<FireUser>;
    GetUserLogin(): Promise<FireUser>;
    /** @deprecated */
    auth(): FireAuth;
    /** @deprecated */
    storage(): FireStorage;
    /** @deprecated */
    GetApp(): FireApp;
    /** @deprecated */
    db(): FireStore;
}
