import {
    IActivity,
    ICondition,
    IAddress,
    IOrigin,
    IVehicle,
    ISex,
    ISector,
    IHairType,
    IHairColor,
    IEyeColor,
    ITattoo,
    IPiercing,
    IScar,
    IPersonStatus
} from "../properties/properties.interface";

export interface IPerson {
    lastname?: string;
    firstname?: string;
    nickname?: string;
    birthDate?: Date;
    origin?: IOrigin;
    sex?: ISex;
    diverLicence?: string;
    fps?: string;
    address: IAddress[];
    phone?: string;
    email?: string;
    activitySector?: ISector;
    hairType?: IHairType;
    hairColor?: IHairColor;
    eyeColor?: IEyeColor;
    tattoo?: ITattoo[];
    piercings?: IPiercing[];
    scars?: IScar[];
    activities?: IActivity[];
    personStatus?: IPersonStatus;
    wanted?: boolean;
    option2?: boolean;
    conditions?: ICondition[];
    filesRelated?: string[];
    vehicles?: IVehicle[];
    relations?: IPerson[];
}