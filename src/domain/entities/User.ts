export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    restaurantId?: string; // Optionnel, uniquement si l'utilisateur possède un restaurant
    createdAt: Date;
    updatedAt: Date;
}