import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../infrastructure/services/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    

    if (!authHeader) {
        return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Token invalide' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Erreur d\'authentification' });
    }
};