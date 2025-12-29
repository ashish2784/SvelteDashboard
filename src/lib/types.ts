export type Machine = {
    id: string;
    status: "ACTIVE" | "IDLE" | "BREAKDOWN" | "OFFLINE" | "UNKNOWN";
    speed: number;
    updated: string;
};
