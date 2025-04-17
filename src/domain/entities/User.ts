import { Restaurant } from './Restaurant';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    restaurant?: Restaurant;
    createdAt: Date;
    updatedAt: Date;
}