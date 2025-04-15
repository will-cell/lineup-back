import { Router } from 'express';
import { RestaurantController } from '../../application/controllers/RestaurantController';
import { authMiddleware } from '../../application/middlewares/authMiddleware';

export const createRestaurantRouter = (restaurantController: RestaurantController) => {
    const router = Router();

    // Routes publiques
    router.get('/nearby', restaurantController.getNearbyRestaurants);
    router.get('/:id', restaurantController.getRestaurantById);

    // Routes protégées
    router.use(authMiddleware);
    router.post('/', restaurantController.createRestaurant);
    router.put('/:id/settings', restaurantController.updateSettings);

    return router;
};