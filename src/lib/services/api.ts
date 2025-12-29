import { transformMachineData } from "../data/transform";
import type { Machine } from "../types";

// PRO-TIP: You can toggle "Chaos Mode" here to test error states
const CHAOS_MODE = true;

export const ApiService = {
    /**
     * Fetches all machines and transforms them for the UI
     */
    async getMachines(): Promise<Machine[]> {
        // Artificial Delay for "Realism"
        await new Promise(r => setTimeout(r, 800));

        // Random Failure Simulation (Day 9)
        if (CHAOS_MODE && Math.random() < 0.1) {
            throw new Error("Network latency exceeded (Simulated Chaos)");
        }

        const res = await fetch("/api/machines");
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

        const rawData = await res.json();
        return transformMachineData(rawData);
    },

    /**
     * Fetches detailed info for a single machine
     */
    async getMachineDetails(id: string): Promise<any> {
        // Artificial Delay
        await new Promise(r => setTimeout(r, 600));

        // Random Failure Simulation
        if (CHAOS_MODE && Math.random() < 0.05) {
            throw new Error("Target machine unreachable (Simulated Chaos)");
        }

        const res = await fetch(`/api/machines/${id}`);
        if (!res.ok) {
            if (res.status === 404) throw new Error("Machine not found");
            throw new Error("Failed to retrieve machine history");
        }

        return await res.json();
    }
};
