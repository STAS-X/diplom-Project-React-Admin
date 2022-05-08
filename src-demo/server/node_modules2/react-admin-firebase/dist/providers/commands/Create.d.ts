import { FireClient } from "../database/FireClient";
import * as ra from "../../misc/react-admin-models";
export declare function Create<T extends ra.Record>(resourceName: string, params: ra.CreateParams, client: FireClient): Promise<ra.CreateResult<T>>;
