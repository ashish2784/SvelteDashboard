import { json, error } from "@sveltejs/kit";

export async function GET({ params }) {
    const { id } = params;

    await new Promise((r) => setTimeout(r, 800));

    const machines = [
        { id: "M-101", model: "ASH-X1", year: 2023, lastMaintenance: "2023-11-15", operator: "A" },
        { id: "M-102", model: "ASH-X2", year: 2022, lastMaintenance: "2023-10-10", operator: "B" },
        { id: "M-103", model: "ASH-X3", year: 2024, lastMaintenance: "2024-01-05", operator: "C" },
        { id: "M-104", model: "ASH-X4", year: 2021, lastMaintenance: "2023-09-20", operator: "D" },
        { id: "M-105", model: "ASH-X5", year: 2024, lastMaintenance: "2024-02-12", operator: "E" }
    ];

    const machine = machines.find(m => m.id === id);

    if (!machine) {
        throw error(404, "Machine not found");
    }

    const history = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        uptime: Math.floor(Math.random() * 24),
        incidents: Math.floor(Math.random() * 2)
    }));

    // Simplified mapping to match the main list API exactly
    const statsMap: Record<string, { status: string, speed: number }> = {
        "M-101": { status: "ACTIVE", speed: 120 },
        "M-102": { status: "IDLE", speed: 0 },
        "M-103": { status: "BREAKDOWN", speed: 170 },
        "M-104": { status: "OFFLINE", speed: 0 },
        "M-105": { status: "ACTIVE", speed: 80 }
    };

    const stats = statsMap[id] || { status: "UNKNOWN", speed: 0 };

    return json({
        ...machine,
        status: stats.status,
        speed: stats.speed,
        history
    });
}
