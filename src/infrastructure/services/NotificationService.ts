import { supabase } from './supabase';

export class NotificationService {
    private static CHANNEL_NAME = 'lineup_notifications';

    async sendNotification(userId: string, message: string) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([
                    {
                        user_id: userId,
                        message,
                        read: false
                    }
                ]);

            if (error) throw error;

            // Envoyer la notification en temps réel
            await supabase
                .channel(NotificationService.CHANNEL_NAME)
                .send({
                    type: 'broadcast',
                    event: 'new_notification',
                    payload: { userId, message }
                });

            return data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
            throw error;
        }
    }

    async subscribeToNotifications(userId: string, callback: (payload: any) => void) {
        return supabase
            .channel(NotificationService.CHANNEL_NAME)
            .on(
                'system',
                { event: 'new_notification', filter: `userId=eq.${userId}` },
                callback
            )
            .subscribe();
    }
}