import { Ticket, TicketStatus } from '../entities/Ticket';
import { ITicketRepository, IRestaurantRepository } from '../repositories/IRepositories';
import { ITicketUseCases } from './IUseCases';
import { NotificationService } from '../../infrastructure/services/NotificationService';

export class TicketUseCases implements ITicketUseCases {
    constructor(
        private ticketRepository: ITicketRepository,
        private restaurantRepository: IRestaurantRepository,
        private notificationService: NotificationService
    ) {}

    async createTicket(
        restaurantId: string,
        userId: string,
        partySize: number,
        firstName: string,
        lastName: string
    ): Promise<Ticket> {
        const restaurant = await this.restaurantRepository.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }

        // Calculer l'heure estimée d'arrivée basée sur les tickets actifs
        const activeTickets = await this.ticketRepository.findActiveByRestaurantId(restaurantId);
        const estimatedWaitingTime = activeTickets.length * restaurant.waitingTimePerTicket;
        const estimatedArrivalTime = new Date();
        estimatedArrivalTime.setMinutes(estimatedArrivalTime.getMinutes() + estimatedWaitingTime);

        const ticket = await this.ticketRepository.create({
            restaurantId,
            userId,
            partySize,
            firstName,
            lastName,
            status: TicketStatus.WAITING,
            estimatedArrivalTime,
        });

        return ticket;
    }

    async updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
        return await this.ticketRepository.update(id, { status });
    }

    async getActiveTickets(restaurantId: string): Promise<Ticket[]> {
        return await this.ticketRepository.findActiveByRestaurantId(restaurantId);
    }

    async getTicketById(id: string): Promise<Ticket | null> {
        return await this.ticketRepository.findById(id);
    }

    async cancelTicket(id: string): Promise<Ticket> {
        const ticket = await this.updateTicketStatus(id, TicketStatus.CANCELLED);
        await this.recalculateQueueTimes(ticket.restaurantId);
        return ticket;
    }

    async notifyTicket(id: string): Promise<Ticket> {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new Error('Ticket non trouvé');
        }

        await this.notificationService.sendNotification(
            ticket.userId,
            `Votre table sera bientôt prête chez ${(await this.restaurantRepository.findById(ticket.restaurantId))?.name}`
        );

        return await this.updateTicketStatus(id, TicketStatus.NOTIFIED);
    }

    async seatTicket(id: string): Promise<Ticket> {
        const ticket = await this.updateTicketStatus(id, TicketStatus.SEATED);
        await this.recalculateQueueTimes(ticket.restaurantId);
        return ticket;
    }

    private async recalculateQueueTimes(restaurantId: string): Promise<void> {
        const restaurant = await this.restaurantRepository.findById(restaurantId);
        if (!restaurant) return;

        const activeTickets = await this.ticketRepository.findActiveByRestaurantId(restaurantId);
        
        // Mettre à jour les temps d'attente estimés pour chaque ticket
        for (let i = 0; i < activeTickets.length; i++) {
            const estimatedWaitingTime = i * restaurant.waitingTimePerTicket;
            const estimatedArrivalTime = new Date();
            estimatedArrivalTime.setMinutes(estimatedArrivalTime.getMinutes() + estimatedWaitingTime);

            await this.ticketRepository.update(activeTickets[i].id, {
                estimatedArrivalTime
            });

            // Vérifier si le ticket doit être notifié
            if (estimatedWaitingTime <= restaurant.notificationThreshold && 
                activeTickets[i].status === TicketStatus.WAITING) {
                await this.notifyTicket(activeTickets[i].id);
            }
        }

        // Mettre à jour le temps d'attente moyen du restaurant
        await this.restaurantRepository.updateAverageWaitingTime(restaurantId);
    }
}