

Welcome to the **RobotSpace Dashboard**! This is a modern, real-time monitoring interface for factory machines, built with **Svelte 5** and **Tailwind CSS**.

## ✨ Features
*   **Live Monitoring**: Automatically polls machine data every 10 seconds.
*   **Smart Filtering**: Instantly filter by status (Active, Idle, Breakdown, or Offline).
*   **Advanced Sorting**: Organize your fleet by Machine ID or find your fastest robots by sorting by RPM.
*   **Deep-Dive Details**: Click any machine to see its installation year, assigned operator, and a 7-day operational history log.
*   **Resilient Design**: Includes high-quality loading skeletons and robust error-handling with built-in retry logic.
*   **Chaos Testing**: Equipped with a "Chaos Mode" service layer to simulate real-world network instability for testing.

## 🛠️ Tech Stack
*   **Framework**: [SvelteKit](https://kit.svelte.dev/) (powered by Svelte 5 Runes)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide Svelte](https://lucide.dev/)
*   **UI Components**: Custom-built with a focus on premium aesthetics and accessibility.

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the dev server:**
    ```bash
    npm run dev
    ```

3.  **View the dashboard:**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧪 Testing "Chaos Mode"
To see how the dashboard handles network errors and latency, look in `src/lib/services/api.ts`. You can toggle `CHAOS_MODE` to `true` to simulate random failures and artificial delays!

---
*Built with ❤️ for a smarter, cleaner factory floor.*
