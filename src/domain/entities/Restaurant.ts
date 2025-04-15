export interface Location {
    latitude: number;
    longitude: number;
    address: string;
}

export interface Restaurant {
    id: string;
    name: string;
    ownerId: string;
    location: Location;
    capacity: number;
    waitingTimePerTicket: number; // Délai d'attente entre chaque ticket en minutes
    notificationThreshold: number; // Délai avant notification en minutes
    averageWaitingTime: number; // Temps d'attente moyen calculé
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}