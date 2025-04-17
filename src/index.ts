import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createRestaurantRouter } from './interfaces/http/restaurantRoutes';
import { createTicketRouter } from './interfaces/http/ticketRoutes';
import { createAuthRouter } from './interfaces/http/authRoutes';

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
import { AuthController } from './application/controllers/AuthController';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL 
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

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
const userUseCases = new UserUseCases(userRepository);

// Initialisation des contrôleurs
const restaurantController = new RestaurantController(restaurantUseCases);
const ticketController = new TicketController(ticketUseCases);
const authController = new AuthController(userUseCases);

// Routes
app.use('/api/auth', createAuthRouter(authController));
app.use('/api/restaurants', createRestaurantRouter(restaurantController));
app.use('/api/tickets', createTicketRouter(ticketController));

// Gestion des erreurs
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur interne est survenue' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});