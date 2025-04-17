import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IRepositories';
import { supabase } from '../services/supabase';

export class SupabaseUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        console.log('findById', id);
        console.log('findById', data, error);
        if (error) throw error;
        return data as User | null;
    }

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .insert([user])
            .select()
            .single();

        if (error) throw error;
        return data as User;
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .update(user)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as User;
    }
}