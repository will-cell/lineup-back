import { Restaurant } from '../entities/Restaurant';
import { IRestaurantRepository } from '../repositories/IRepositories';
import { IRestaurantUseCases } from './IUseCases';

export class RestaurantUseCases implements IRestaurantUseCases {
    constructor(private restaurantRepository: IRestaurantRepository) {}

    async createRestaurant(
        ownerId: string,
        restaurantData: Omit<Restaurant, 'id' | 'ownerId' | 'averageWaitingTime' | 'createdAt' | 'updatedAt'>
    ): Promise<Restaurant> {
        const restaurant = await this.restaurantRepository.create({
            ...restaurantData,
            ownerId,
        });
        return restaurant;
    }

    async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
        return await this.restaurantRepository.update(id, data);
    }

    async getRestaurantById(id: string): Promise<Restaurant | null> {
        return await this.restaurantRepository.findById(id);
    }

    async getNearbyRestaurants(latitude: number, longitude: number, radiusKm: number): Promise<Restaurant[]> {
        return await this.restaurantRepository.findNearby(latitude, longitude, radiusKm);
    }

    async updateSettings(
        id: string,
        waitingTimePerTicket: number,
        capacity: number,
        notificationThreshold: number
    ): Promise<Restaurant> {

        // Mettre à jour le temps d'attente moyen après modification des paramètres
        return await this.restaurantRepository.updateAverageWaitingTime(id);
    }
}