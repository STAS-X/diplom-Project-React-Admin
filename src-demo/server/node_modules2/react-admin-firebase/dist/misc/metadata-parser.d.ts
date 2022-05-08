import { RAFirebaseOptions } from "index";
import { IFirebaseWrapper, ResourceManager } from "providers/database";
export declare function AddCreatedByFields(obj: any, fireWrapper: IFirebaseWrapper, rm: Pick<ResourceManager, "getUserIdentifier">, options: Pick<RAFirebaseOptions, "associateUsersById" | "disableMeta" | "renameMetaFields" | "metaFieldCasing">): Promise<void>;
export declare function AddUpdatedByFields(obj: any, fireWrapper: IFirebaseWrapper, rm: Pick<ResourceManager, "getUserIdentifier">, options: Pick<RAFirebaseOptions, "associateUsersById" | "disableMeta" | "renameMetaFields" | "metaFieldCasing">): Promise<void>;
export declare function GetSelectorsUpdateAt(options: Pick<RAFirebaseOptions, "metaFieldCasing" | "renameMetaFields">): string;
export declare function GetSelectorsUpdateBy(options: Pick<RAFirebaseOptions, "metaFieldCasing" | "renameMetaFields">): string;
export declare function GetSelectorsCreateAt(options: Pick<RAFirebaseOptions, "metaFieldCasing" | "renameMetaFields">): string;
export declare function GetSelectorsCreateBy(options: Pick<RAFirebaseOptions, "metaFieldCasing" | "renameMetaFields">): string;
