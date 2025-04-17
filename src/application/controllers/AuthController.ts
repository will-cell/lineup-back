import { Request, Response } from 'express';
import { supabase } from '../../infrastructure/services/supabase';
import { IUserUseCases } from '../../domain/usecases/IUseCases';

export class AuthController {
    constructor(private userUseCases: IUserUseCases) {}

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return res.status(401).json({ error: 'Identifiants invalides' });
            }

            const user = await this.userUseCases.getUserById(data.user.id);

            // Définir les cookies pour les tokens
            res.cookie('access_token', data.session?.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000 // 1 heure
            });

            res.cookie('refresh_token', data.session?.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
            });

            res.json({
                user,
                session: {
                    ...data.session,
                    // Ne pas renvoyer les tokens dans la réponse JSON pour plus de sécurité
                    access_token: undefined,
                    refresh_token: undefined
                }
            });
        } catch (error) {
            console.error('Erreur de connexion:', error);
            res.status(500).json({ error: 'Erreur lors de la connexion' });
        }
    };

    logout = async (_req: Request, res: Response) => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            // Supprimer les cookies
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');

            res.json({ message: 'Déconnexion réussie' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies?.refresh_token;
            
            if (!refreshToken) {
                return res.status(401).json({ error: 'Refresh token manquant' });
            }

            const { data: { session }, error } = await supabase.auth.refreshSession({
                refresh_token: refreshToken
            });

            if (error || !session) {
                return res.status(401).json({ error: 'Impossible de rafraîchir la session' });
            }

            // Mettre à jour les cookies
            res.cookie('access_token', session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000
            });

            res.cookie('refresh_token', session.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.json({
                session: {
                    ...session,
                    access_token: undefined,
                    refresh_token: undefined
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors du rafraîchissement du token' });
        }
    };

    getCurrentUser = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Non authentifié' });
            }

            // Récupérer les informations détaillées de l'utilisateur depuis notre base de données
            const user = await this.userUseCases.getUserById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Si l'utilisateur est propriétaire d'un restaurant, récupérer les informations du restaurant
            let restaurantInfo = null;
            if (user.restaurantId) {
                const { data: restaurant } = await supabase
                    .from('restaurants')
                    .select('*')
                    .eq('id', user.restaurantId)
                    .single();
                
                if (restaurant) {
                    restaurantInfo = restaurant;
                }
            }

            res.json({
                ...user,
                restaurant: restaurantInfo
            });
        } catch (error) {
            console.error('Erreur getCurrentUser:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
        }
    };

    // ...existing code for register, requestPasswordReset, and resetPassword...
}