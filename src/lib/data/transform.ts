import type { Machine } from "../types";

export function transformMachineData(data: any[]): Machine[] {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
        // Handle missing ID
        const id = item.machine_id || "Unknown";

        // Map status code
        let status: Machine["status"] = "UNKNOWN";
        switch (item.status_code) {
            case 0: status = "OFFLINE"; break;
            case 1: status = "ACTIVE"; break;
            case 2: status = "IDLE"; break;
            case 3: status = "BREAKDOWN"; break;
            default: status = "UNKNOWN";
        }

        // Handle speed
        const speed = typeof item.rpm === 'number' ? item.rpm : 0;

        // Handle date
        let updated = "N/A";
        if (item.last_seen) {
            try {
                const date = new Date(item.last_seen);
                if (!isNaN(date.getTime())) {
                    updated = date.toLocaleTimeString();
                }
            } catch (e) {
                // ignore invalid date
            }
        }

        return {
            id,
            status,
            speed,
            updated
        };
    });
}
