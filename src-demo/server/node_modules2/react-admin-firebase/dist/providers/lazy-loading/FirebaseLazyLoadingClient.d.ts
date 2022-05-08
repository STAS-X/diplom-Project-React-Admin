import { messageTypes } from '../../misc';
import { ResourceManager } from '../database/ResourceManager';
import { RAFirebaseOptions } from '../options';
import * as ra from '../../misc/react-admin-models';
import { FireClient } from 'providers/database';
export declare class FirebaseLazyLoadingClient {
    private readonly options;
    private readonly rm;
    private client;
    constructor(options: RAFirebaseOptions, rm: ResourceManager, client: FireClient);
    apiGetList<T extends ra.Record>(resourceName: string, reactAdminParams: ra.GetListParams): Promise<ra.GetListResult<T>>;
    apiGetManyReference(resourceName: string, reactAdminParams: messageTypes.IParamsGetManyReference): Promise<messageTypes.IResponseGetManyReference>;
    private checkIfOnLastPage;
    clearQueryCursors(resourceName: string): void;
    private tryGetResource;
}
