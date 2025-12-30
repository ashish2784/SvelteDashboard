import { json } from "@sveltejs/kit";

export async function GET() {
    await new Promise((r) => setTimeout(r, 1200));

    // TODO: fetch from API 
    // status-code: 0 - offline, 1 - active, 2 - idle, 3 - breakdown

    const data = [
        {
            machine_id: "M-101",
            status_code: 1,
            rpm: 120 + Math.floor(Math.random() * 20 - 10), // Randomize around 120
            last_seen: new Date().toISOString()
        },
        {
            machine_id: "M-102",
            status_code: 2,
            rpm: 0,
            last_seen: new Date(Date.now() - 2 * 60000).toISOString()
        },
        {
            machine_id: "M-103",
            status_code: 3,
            rpm: 170,
            last_seen: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
            machine_id: "M-104",
            status_code: 0,
            rpm: 0,
            last_seen: null
        },
        {
            machine_id: "M-105",
            status_code: 1,
            rpm: 80 + Math.floor(Math.random() * 10 - 5), // Randomize around 80
            last_seen: new Date().toISOString()
        }
    ];

    return json(data);
}
