import { FireClient } from "../database/FireClient";
import * as ra from "../../misc/react-admin-models";
export declare function Delete<T extends ra.Record>(resourceName: string, params: ra.DeleteParams, client: FireClient): Promise<ra.DeleteResult<T>>;
