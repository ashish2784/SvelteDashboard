import { transformMachineData } from "../data/transform";
import type { Machine } from "../types";

const DEBUG_ERRORS = true;

export const ApiService = {
    async getMachines(): Promise<Machine[]> {
        await new Promise(r => setTimeout(r, 800));

        if (DEBUG_ERRORS && Math.random() < 0.1) {
            throw new Error("Connection failed");
        }

        const res = await fetch("/api/machines");
        if (!res.ok) throw new Error("Could not fetch machines");

        const rawData = await res.json();
        return transformMachineData(rawData);
    },

    async getMachineDetails(id: string): Promise<any> {
        await new Promise(r => setTimeout(r, 600));

        if (DEBUG_ERRORS && Math.random() < 0.05) {
            throw new Error("Machine unavailable");
        }

        const res = await fetch(`/api/machines/${id}`);
        if (!res.ok) {
            if (res.status === 404) throw new Error("Machine not found");
            throw new Error("Failed to load history");
        }

        return await res.json();
    }
};
