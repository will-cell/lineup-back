import { Router } from 'express';
import { TicketController } from '../../application/controllers/TicketController';
import { authMiddleware } from '../../application/middlewares/authMiddleware';

export const createTicketRouter = (ticketController: TicketController) => {
    const router = Router();

    // Toutes les routes des tickets nécessitent une authentification
    router.use(authMiddleware);

    router.post('/', ticketController.createTicket);
    router.get('/restaurant/:restaurantId', ticketController.getActiveTickets);
    router.get('/:id', ticketController.getTicketById);
    router.post('/:id/cancel', ticketController.cancelTicket);
    router.post('/:id/notify', ticketController.notifyTicket);
    router.post('/:id/seat', ticketController.seatTicket);

    return router;
};