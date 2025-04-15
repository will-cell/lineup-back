import { Restaurant } from '../entities/Restaurant';
import { Ticket, TicketStatus } from '../entities/Ticket';
import { User } from '../entities/User';

export interface IRestaurantUseCases {
    createRestaurant(ownerId: string, restaurantData: Omit<Restaurant, 'id' | 'ownerId' | 'averageWaitingTime' | 'createdAt' | 'updatedAt'>): Promise<Restaurant>;
    updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant>;
    getRestaurantById(id: string): Promise<Restaurant | null>;
    getNearbyRestaurants(latitude: number, longitude: number, radiusKm: number): Promise<Restaurant[]>;
    updateSettings(id: string, waitingTimePerTicket: number, capacity: number, notificationThreshold: number): Promise<Restaurant>;
}

export interface ITicketUseCases {
    createTicket(restaurantId: string, userId: string, partySize: number, firstName: string, lastName: string): Promise<Ticket>;
    updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket>;
    getActiveTickets(restaurantId: string): Promise<Ticket[]>;
    getTicketById(id: string): Promise<Ticket | null>;
    cancelTicket(id: string): Promise<Ticket>;
    notifyTicket(id: string): Promise<Ticket>;
    seatTicket(id: string): Promise<Ticket>;
}

export interface IUserUseCases {
    createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    updateUser(id: string, data: Partial<User>): Promise<User>;
}