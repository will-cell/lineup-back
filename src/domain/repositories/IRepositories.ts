import { User } from '../entities/User';
import { Restaurant } from '../entities/Restaurant';
import { Ticket } from '../entities/Ticket';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User>;
}

export interface IRestaurantRepository {
    findById(id: string): Promise<Restaurant | null>;
    findByOwnerId(ownerId: string): Promise<Restaurant[]>;
    findNearby(latitude: number, longitude: number, radiusKm: number): Promise<Restaurant[]>;
    create(restaurant: Omit<Restaurant, 'id' | 'averageWaitingTime' | 'createdAt' | 'updatedAt'>): Promise<Restaurant>;
    update(id: string, restaurant: Partial<Restaurant>): Promise<Restaurant>;
    updateAverageWaitingTime(id: string): Promise<Restaurant>;
}

export interface ITicketRepository {
    findById(id: string): Promise<Ticket | null>;
    findByRestaurantId(restaurantId: string): Promise<Ticket[]>;
    findActiveByRestaurantId(restaurantId: string): Promise<Ticket[]>;
    create(ticket: Omit<Ticket, 'id' | 'waitingTime' | 'createdAt' | 'updatedAt'>): Promise<Ticket>;
    update(id: string, ticket: Partial<Ticket>): Promise<Ticket>;
    updateWaitingTime(id: string): Promise<Ticket>;
}