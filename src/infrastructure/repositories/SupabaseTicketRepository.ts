import { Ticket, TicketStatus } from '../../domain/entities/Ticket';
import { ITicketRepository } from '../../domain/repositories/IRepositories';
import { supabase } from '../services/supabase';

export class SupabaseTicketRepository implements ITicketRepository {
    async findById(id: string): Promise<Ticket | null> {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Ticket | null;
    }

    async findByRestaurantId(restaurantId: string): Promise<Ticket[]> {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('restaurantId', restaurantId)
            .order('createdAt', { ascending: true });

        if (error) throw error;
        return data as Ticket[];
    }

    async findActiveByRestaurantId(restaurantId: string): Promise<Ticket[]> {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('restaurantId', restaurantId)
            .in('status', [TicketStatus.WAITING, TicketStatus.NOTIFIED])
            .order('createdAt', { ascending: true });

        if (error) throw error;
        return data as Ticket[];
    }

    async create(ticket: Omit<Ticket, 'id' | 'waitingTime' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
        const { data, error } = await supabase
            .from('tickets')
            .insert([{
                ...ticket,
                waitingTime: 0
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Ticket;
    }

    async update(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
        const { data, error } = await supabase
            .from('tickets')
            .update(ticket)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Ticket;
    }

    async updateWaitingTime(id: string): Promise<Ticket> {
        // Calcul du temps d'attente en minutes depuis la création du ticket
        const { data, error } = await supabase.rpc('update_ticket_waiting_time', {
            ticket_id: id
        });

        if (error) throw error;
        return data as Ticket;
    }
}