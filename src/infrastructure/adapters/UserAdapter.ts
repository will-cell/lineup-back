import { User } from '../../domain/entities/User';

interface UserDTO {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    restaurant_id: string | null;
    created_at: string;
    updated_at: string;
}

export class UserAdapter {
    static toDomain(dto: UserDTO): User {
        return {
            id: dto.id,
            email: dto.email,
            firstName: dto.first_name,
            lastName: dto.last_name,
            restaurantId: dto.restaurant_id || '',
            createdAt: new Date(dto.created_at),
            updatedAt: new Date(dto.updated_at)
        };
    }

    static toDTO(domain: User): UserDTO {
        return {
            id: domain.id,
            email: domain.email,
            first_name: domain.firstName,
            last_name: domain.lastName,
            restaurant_id: domain.restaurantId || null,
            created_at: domain.createdAt.toISOString(),
            updated_at: domain.updatedAt.toISOString()
        };
    }
}