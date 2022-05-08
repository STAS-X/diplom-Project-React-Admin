import { FireClient } from "../database/FireClient";
import * as ra from "../../misc/react-admin-models";
export declare function GetManyReference<T extends ra.Record>(resourceName: string, params: ra.GetManyReferenceParams, client: FireClient): Promise<ra.GetManyReferenceResult<T>>;
