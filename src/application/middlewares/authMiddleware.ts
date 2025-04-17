import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../infrastructure/services/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    try {
        const token = authHeader.split(' ')[1];
        
        // Vérifier si le token est valide
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (!userError && user) {
            req.user = user;
            return next();
        }

        // Si le token est invalide ou expiré, essayer de le rafraîchir
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Token expiré' });
        }

        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (refreshError || !session) {
            return res.status(401).json({ error: 'Impossible de rafraîchir la session' });
        }

        // Mettre à jour les cookies avec les nouveaux tokens
        res.cookie('access_token', session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000 // 1 heure
        });

        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 jours
        });

        req.user = session.user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Erreur d\'authentification' });
    }
};