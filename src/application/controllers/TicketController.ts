import { Request, Response } from 'express';
import { ITicketUseCases } from '../../domain/usecases/IUseCases';

export class TicketController {
    constructor(private ticketUseCases: ITicketUseCases) {}

    createTicket = async (req: Request, res: Response) => {
        try {
            const { restaurantId, partySize, firstName, lastName } = req.body;
            if (!req.user) {
                return res.status(401).json({ error: 'Utilisateur non authentifié' });
            }
            const userId = req.user.id;

            const ticket = await this.ticketUseCases.createTicket(
                restaurantId,
                userId,
                partySize,
                firstName,
                lastName
            );

            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la création du ticket' });
        }
    };

    getActiveTickets = async (req: Request, res: Response) => {
        try {
            const { restaurantId } = req.params;
            const tickets = await this.ticketUseCases.getActiveTickets(restaurantId);
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
        }
    };

    cancelTicket = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const ticket = await this.ticketUseCases.cancelTicket(id);
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de l\'annulation du ticket' });
        }
    };

    notifyTicket = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const ticket = await this.ticketUseCases.notifyTicket(id);
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la notification du ticket' });
        }
    };

    seatTicket = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const ticket = await this.ticketUseCases.seatTicket(id);
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors du placement du ticket' });
        }
    };

    getTicketById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const ticket = await this.ticketUseCases.getTicketById(id);

            if (!ticket) {
                return res.status(404).json({ error: 'Ticket non trouvé' });
            }

            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération du ticket' });
        }
    };
}