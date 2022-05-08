import { FireClient } from '../database/FireClient';
import * as ra from '../../misc/react-admin-models';
export declare function GetList<T extends ra.Record>(resourceName: string, params: ra.GetListParams, client: FireClient): Promise<ra.GetListResult<T>>;
