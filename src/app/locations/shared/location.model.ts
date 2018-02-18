import { Category } from "../../categories/shared/category.model";

export class Location {
    constructor(
        public id: number,
        public name: string,
        public address: any,
        public coordinates: Coordinates,
        public category: Category
    ) { }
}

export class Coordinates {
    lat: number;
    lng: number;
}
