import { FireClient } from '../database/FireClient';
import * as ra from '../../misc/react-admin-models';
export declare function GetMany<T extends ra.Record>(resourceName: string, params: ra.GetManyParams, client: FireClient): Promise<ra.GetManyResult<T>>;
