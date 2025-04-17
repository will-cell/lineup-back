import { Restaurant } from '../../domain/entities/Restaurant';

export interface RestaurantDTO {
    id: string;
    name: string;
    owner_id: string;
    latitude: number;
    longitude: number;
    address: string;
    capacity: number;
    waiting_time_per_ticket: number; // Délai d'attente entre chaque ticket en minutes
    notification_threshold: number; // Délai avant notification en minutes
    average_waiting_time: number; // Temps d'attente moyen calculé
    is_open: boolean;
    created_at: string;
    updated_at: string;
}

export class RestaurantAdapter {

    static toDomain(restaurant: RestaurantDTO): Restaurant {
        return {
            id: restaurant.id,
            name: restaurant.name,
            ownerId: restaurant.owner_id,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            address: restaurant.address,
            capacity: restaurant.capacity,
            waitingTimePerTicket: restaurant.waiting_time_per_ticket,
            notificationThreshold: restaurant.notification_threshold,
            averageWaitingTime: restaurant.average_waiting_time,
            isOpen: restaurant.is_open,
            createdAt: new Date(restaurant.created_at),
            updatedAt: new Date(restaurant.updated_at)
        };
    }

    static toDTO(restaurant: Restaurant): RestaurantDTO {
        return {
            id: restaurant.id,
            name: restaurant.name,
            owner_id: restaurant.ownerId,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            address: restaurant.address,
            capacity: restaurant.capacity,
            waiting_time_per_ticket: restaurant.waitingTimePerTicket,
            notification_threshold: restaurant.notificationThreshold,
            average_waiting_time: restaurant.averageWaitingTime,
            is_open: restaurant.isOpen,
            created_at: restaurant.createdAt.toISOString(),
            updated_at: restaurant.updatedAt.toISOString()
        };
    }
}