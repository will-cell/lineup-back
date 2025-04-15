declare namespace Express {
    interface Request {
        user?: {
            id: string;
            email: string;
            [key: string]: any;
        };
    }
}