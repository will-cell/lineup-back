import { Request, Response } from 'express';
import { IRestaurantUseCases } from '../../domain/usecases/IUseCases';

export class RestaurantController {
    constructor(private restaurantUseCases: IRestaurantUseCases) {}

    async createRestaurant = async (req: Request, res: Response) => {
        try {
            const { name, location, capacity, waitingTimePerTicket, notificationThreshold } = req.body;
            const ownerId = req.user.id;

            const restaurant = await this.restaurantUseCases.createRestaurant(ownerId, {
                name,
                location,
                capacity,
                waitingTimePerTicket,
                notificationThreshold,
                isOpen: true,
            });

            res.status(201).json(restaurant);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la création du restaurant' });
        }
    };

    async updateSettings = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { waitingTimePerTicket, capacity, notificationThreshold } = req.body;

            const restaurant = await this.restaurantUseCases.updateSettings(
                id,
                waitingTimePerTicket,
                capacity,
                notificationThreshold
            );

            res.json(restaurant);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres' });
        }
    };

    async getNearbyRestaurants = async (req: Request, res: Response) => {
        try {
            const { latitude, longitude, radius } = req.query;
            const lat = parseFloat(latitude as string);
            const lng = parseFloat(longitude as string);
            const radiusKm = parseFloat(radius as string) || 5; // Rayon par défaut de 5km

            const restaurants = await this.restaurantUseCases.getNearbyRestaurants(lat, lng, radiusKm);
            res.json(restaurants);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la recherche des restaurants' });
        }
    };

    async getRestaurantById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const restaurant = await this.restaurantUseCases.getRestaurantById(id);

            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant non trouvé' });
            }

            res.json(restaurant);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération du restaurant' });
        }
    };
}