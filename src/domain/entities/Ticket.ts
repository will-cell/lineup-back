export enum TicketStatus {
    WAITING = 'waiting',
    NOTIFIED = 'notified',
    CANCELLED = 'cancelled',
    SEATED = 'seated'
}

export interface Ticket {
    id: string;
    restaurantId: string;
    userId: string;
    partySize: number;
    firstName: string;
    lastName: string;
    status: TicketStatus;
    waitingTime: number; // Temps écoulé depuis la création du ticket en minutes
    estimatedArrivalTime: Date;
    createdAt: Date;
    updatedAt: Date;
}