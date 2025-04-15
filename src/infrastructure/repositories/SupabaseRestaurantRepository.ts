import { Restaurant } from '../../domain/entities/Restaurant';
import { IRestaurantRepository } from '../../domain/repositories/IRepositories';
import { supabase } from '../services/supabase';

export class SupabaseRestaurantRepository implements IRestaurantRepository {
    async findById(id: string): Promise<Restaurant | null> {
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Restaurant | null;
    }

    async findByOwnerId(ownerId: string): Promise<Restaurant[]> {
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('owner_id', ownerId);

        if (error) throw error;
        return data as Restaurant[];
    }

    async findNearby(latitude: number, longitude: number, radiusKm: number): Promise<Restaurant[]> {
        // Utilisation de la fonction ST_DWithin de PostGIS pour trouver les restaurants à proximité
        const { data, error } = await supabase.rpc('find_restaurants_nearby', {
            lat: latitude,
            lng: longitude,
            radius_km: radiusKm
        });

        if (error) throw error;
        return data as Restaurant[];
    }

    async create(restaurant: Omit<Restaurant, 'id' | 'averageWaitingTime' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> {
        const { data, error } = await supabase
            .from('restaurants')
            .insert([{
                ...restaurant,
                averageWaitingTime: 0
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Restaurant;
    }

    async update(id: string, restaurant: Partial<Restaurant>): Promise<Restaurant> {
        const { data, error } = await supabase
            .from('restaurants')
            .update(restaurant)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Restaurant;
    }

    async updateAverageWaitingTime(id: string): Promise<Restaurant> {
        // Calcul du temps moyen d'attente basé sur les tickets récents
        const { data, error } = await supabase.rpc('calculate_average_waiting_time', {
            restaurant_id: id
        });

        if (error) throw error;
        return data as Restaurant;
    }
}