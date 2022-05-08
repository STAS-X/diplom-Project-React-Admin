import { FireClient } from "../database/FireClient";
import * as ra from "../../misc/react-admin-models";
export declare function Update<T extends ra.Record>(resourceName: string, params: ra.UpdateParams, client: FireClient): Promise<ra.UpdateResult<T>>;
