import express from 'express';
import cors from 'cors';
import { createRestaurantRouter } from './interfaces/http/restaurantRoutes';
import { createTicketRouter } from './interfaces/http/ticketRoutes';

// Repositories
import { SupabaseRestaurantRepository } from './infrastructure/repositories/SupabaseRestaurantRepository';
import { SupabaseTicketRepository } from './infrastructure/repositories/SupabaseTicketRepository';
import { SupabaseUserRepository } from './infrastructure/repositories/SupabaseUserRepository';

// Use Cases
import { RestaurantUseCases } from './domain/usecases/RestaurantUseCases';
import { TicketUseCases } from './domain/usecases/TicketUseCases';
import { UserUseCases } from './domain/usecases/UserUseCases';

// Services
import { NotificationService } from './infrastructure/services/NotificationService';

// Controllers
import { RestaurantController } from './application/controllers/RestaurantController';
import { TicketController } from './application/controllers/TicketController';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialisation des repositories
const restaurantRepository = new SupabaseRestaurantRepository();
const ticketRepository = new SupabaseTicketRepository();
const userRepository = new SupabaseUserRepository();

// Initialisation des services
const notificationService = new NotificationService();

// Initialisation des cas d'utilisation
const restaurantUseCases = new RestaurantUseCases(restaurantRepository);
const ticketUseCases = new TicketUseCases(
    ticketRepository,
    restaurantRepository,
    notificationService
);

// Initialisation des contrôleurs
const restaurantController = new RestaurantController(restaurantUseCases);
const ticketController = new TicketController(ticketUseCases);

// Routes
app.use('/api/restaurants', createRestaurantRouter(restaurantController));
app.use('/api/tickets', createTicketRouter(ticketController));

// Gestion des erreurs
app.use((err: Error, req: express.Request, res: express.Response) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur interne est survenue' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});