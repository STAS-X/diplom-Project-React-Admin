import { FireClient } from '../database/FireClient';
import * as ra from '../../misc/react-admin-models';
export declare function GetOne<T extends ra.Record>(resourceName: string, params: ra.GetOneParams, client: FireClient): Promise<ra.GetOneResult<T>>;
