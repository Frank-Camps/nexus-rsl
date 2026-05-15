import {ICarBrand, ICarModel, ICarStatus} from "../properties/properties.interface";

export interface IVehicle {
    plate?: string;
    brand?: ICarBrand;
    model?: ICarModel;
    carStatus?: ICarStatus;
    owner?: IPerson;
    relatedPerson?: IPerson[];
    createdAt?: Date;
    updatedAt?: Date;
}