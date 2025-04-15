import { User } from '../entities/User';
import { IUserRepository } from '../repositories/IRepositories';
import { IUserUseCases } from './IUseCases';

export class UserUseCases implements IUserUseCases {
    constructor(private userRepository: IUserRepository) {}

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        return await this.userRepository.create(userData);
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        return await this.userRepository.update(id, data);
    }
}