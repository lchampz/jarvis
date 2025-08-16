
import type { VisitorActions } from "./actions.enum";

export interface ILog {
    id: string;
    visitorId: string;
    roomId: string;
    action: VisitorActions;
    timestamp: Date;

    createdAt: Date;
    updatedAt: Date;
}