import { json, error } from "@sveltejs/kit";

export async function GET({ params }) {
    const { id } = params;

    await new Promise((r) => setTimeout(r, 800));

    const machines = [
        { id: "M-101", model: "Titan-X1", year: 2023, lastMaintenance: "2023-11-15", operator: "John Doe" },
        { id: "M-102", model: "Titan-X1", year: 2022, lastMaintenance: "2023-10-10", operator: "Jane Smith" },
        { id: "M-103", model: "Apex-2000", year: 2024, lastMaintenance: "2024-01-05", operator: "Mike Ross" },
        { id: "M-104", model: "Titan-X1", year: 2021, lastMaintenance: "2023-09-20", operator: "Sarah Connor" },
        { id: "M-105", model: "Apex-3000", year: 2024, lastMaintenance: "2024-02-12", operator: "Robotron" }
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

    return json({
        ...machine,
        history
    });
}
