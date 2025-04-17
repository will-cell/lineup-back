import { User } from '../../domain/entities/User';
import { RestaurantDTO } from './RestaurantAdapter';

export interface UserDTO {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    restaurant_id: string | null;
    created_at: string;
    updated_at: string;
    restaurant?: RestaurantDTO;
}

export class UserAdapter {
    static toDomain(dto: UserDTO): User {
        return {
            id: dto.id,
            email: dto.email,
            firstName: dto.first_name,
            lastName: dto.last_name,
            restaurant: dto.restaurant ? {
                id: dto.restaurant.id,
                name: dto.restaurant.name,
                ownerId: dto.restaurant.owner_id,
                latitude: dto.restaurant.latitude,
                longitude: dto.restaurant.longitude,
                address: dto.restaurant.address,
                capacity: dto.restaurant.capacity,
                waitingTimePerTicket: dto.restaurant.waiting_time_per_ticket,
                notificationThreshold: dto.restaurant.notification_threshold,
                averageWaitingTime: dto.restaurant.average_waiting_time,
                isOpen: dto.restaurant.is_open,
                createdAt: new Date(dto.restaurant.created_at),
                updatedAt: new Date(dto.restaurant.updated_at)
            } : undefined,
            createdAt: new Date(dto.created_at),
            updatedAt: new Date(dto.updated_at)
        };
    }

    static toDTO(domain: User): UserDTO {
        const dto: UserDTO = {
            id: domain.id,
            email: domain.email,
            first_name: domain.firstName,
            last_name: domain.lastName,
            restaurant_id: domain.restaurant?.id || null,
            created_at: domain.createdAt.toISOString(),
            updated_at: domain.updatedAt.toISOString()
        };

        if (domain.restaurant) {
            dto.restaurant = {
                id: domain.restaurant.id,
                name: domain.restaurant.name,
                owner_id: domain.restaurant.ownerId,
                latitude: domain.restaurant.latitude,
                longitude: domain.restaurant.longitude,
                address: domain.restaurant.address,
                capacity: domain.restaurant.capacity,
                waiting_time_per_ticket: domain.restaurant.waitingTimePerTicket,
                notification_threshold: domain.restaurant.notificationThreshold,
                average_waiting_time: domain.restaurant.averageWaitingTime,
                is_open: domain.restaurant.isOpen,
                created_at: domain.restaurant.createdAt.toISOString(),
                updated_at: domain.restaurant.updatedAt.toISOString()
            };
        }

        return dto;
    }
}