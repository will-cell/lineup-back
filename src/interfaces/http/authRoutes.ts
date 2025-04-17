import { Router } from 'express';
import { AuthController } from '../../application/controllers/AuthController';
import { authMiddleware } from '../../application/middlewares/authMiddleware';

export const createAuthRouter = (authController: AuthController) => {
    const router = Router();

    // Routes publiques
    router.post('/login', authController.login);
    router.post('/refresh-token', authController.refreshToken);
    
    // Routes protégées
    router.use(authMiddleware);
    router.post('/logout', authController.logout);
    router.get('/me', authController.getCurrentUser);

    return router;
};