import type { Machine } from "../types";

export const machines: Machine[] = [
    {
        id: "M-101",
        status: "ACTIVE",
        speed: 120,
        updated: "just now",
        color: "green"
    },
    {
        id: "M-102",
        status: "IDLE",
        speed: 0,
        updated: "5 mins ago",
        color: "yellow"
    },
    {
        id: "M-103",
        status: "BREAKDOWN",
        speed: 170,
        updated: "10 mins ago",
        color: "red"
    },
    {
        id: "M-104",
        status: "OFFLINE",
        speed: 0,
        updated: "N/A",
        color: "gray"
    }
];