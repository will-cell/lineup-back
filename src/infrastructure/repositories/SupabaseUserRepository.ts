import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IRepositories';
import { supabase } from '../services/supabase';
import { UserAdapter } from '../adapters/UserAdapter';

export class SupabaseUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select(`
                *,
                restaurant:restaurants!users_restaurant_id_fkey(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data ? UserAdapter.toDomain(data) : null;
    }

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const dto = UserAdapter.toDTO({
            ...user,
            id: '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const { data, error } = await supabase
            .from('users')
            .insert([{
                email: dto.email,
                first_name: dto.first_name,
                last_name: dto.last_name,
                restaurant_id: dto.restaurant_id
            }])
            .select(`
                *,
                restaurant:restaurants!users_restaurant_id_fkey(*)
            `)
            .single();

        if (error) throw error;
        return UserAdapter.toDomain(data);
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        // Convertir les propriétés en snake_case pour la base de données
        const updateData: Record<string, any> = {};
        if (user.firstName) updateData.first_name = user.firstName;
        if (user.lastName) updateData.last_name = user.lastName;
        if (user.email) updateData.email = user.email;
        if (user.restaurant) updateData.restaurant_id = user.restaurant.id;

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                restaurant:restaurants!users_restaurant_id_fkey(*)
            `)
            .single();

        if (error) throw error;
        return UserAdapter.toDomain(data);
    }
}