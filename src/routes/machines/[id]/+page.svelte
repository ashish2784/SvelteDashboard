<script lang="ts">
    import { page } from "$app/state";
    import Nav from "$lib/components/navbar.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { ApiService } from "$lib/services/api";

    let machineId = $derived(page.params.id);
    let details = $state<any>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let lastRefreshed = $state<string | null>(null);

    const colorMap: Record<
        string,
        { bg: string; badge: string; text: string; stroke: string; bar: string }
    > = {
        ACTIVE: {
            bg: "bg-green-50",
            badge: "bg-green-200",
            text: "text-green-700",
            stroke: "stroke-green-500",
            bar: "bg-green-500",
        },
        IDLE: {
            bg: "bg-yellow-50",
            badge: "bg-yellow-200",
            text: "text-yellow-700",
            stroke: "stroke-yellow-500",
            bar: "bg-yellow-500",
        },
        BREAKDOWN: {
            bg: "bg-red-50",
            badge: "bg-red-200",
            text: "text-red-700",
            stroke: "stroke-red-500",
            bar: "bg-red-500",
        },
        OFFLINE: {
            bg: "bg-gray-50",
            badge: "bg-gray-200",
            text: "text-gray-700",
            stroke: "stroke-gray-500",
            bar: "bg-gray-500",
        },
        UNKNOWN: {
            bg: "bg-gray-50",
            badge: "bg-gray-200",
            text: "text-gray-700",
            stroke: "stroke-gray-500",
            bar: "bg-gray-500",
        },
    };

    let colors = $derived(colorMap[details?.status] ?? colorMap["UNKNOWN"]);

    async function fetchDetails() {
        if (!machineId) return;
        loading = true;
        error = null;
        try {
            details = await ApiService.getMachineDetails(machineId as string);
            lastRefreshed = new Date().toLocaleTimeString();
        } catch (e: any) {
            error = e.message || "Could not load machine details.";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        if (machineId) fetchDetails();
    });
</script>

<Nav
    title={`${machineId} Overview`}
    {lastRefreshed}
    {loading}
    onRefresh={fetchDetails}
/>

<div class="flex flex-col min-h-screen bg-slate-50 font-sans">
    <main class="max-w-7xl mx-auto p-6 md:p-12 w-full">
        <!-- Navigation Header -->
        <div class="flex items-center justify-between mb-8">
            <nav class="text-sm text-gray-500 font-medium">
                <a href="/" class="text-black">Machines</a>
                <span class="mx-2">/</span>
                <span class="text-orange-500 uppercase tracking-wider"
                    >{machineId}</span
                >
            </nav>

            <a
                href="/"
                class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-orange-500 transition-all shadow-sm group"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Dashboard
            </a>
        </div>

        {#if loading}
            <div class="space-y-6">
                <Skeleton class="h-10 w-1/4" />
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton class="h-32 w-full" />
                    <Skeleton class="h-32 w-full" />
                    <Skeleton class="h-32 w-full" />
                </div>
                <Skeleton class="h-64 w-full" />
            </div>
        {:else if error}
            <div
                class="rounded-lg bg-red-50 p-6 text-red-700 border border-red-200"
            >
                <h3 class="font-bold">Error</h3>
                <p>{error}</p>
                <button
                    onclick={fetchDetails}
                    class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                >
                    Retry
                </button>
            </div>
        {:else if details}
            <div
                class={`rounded-3xl p-8 mb-8 shadow-xl ${colors.bg} transition-all duration-500`}
            >
                <header
                    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                >
                    <div>
                        <h1 class="text-4xl font-black text-gray-900">
                            {details.id}
                        </h1>
                        <p class="text-lg text-gray-500 font-medium">
                            {details.model} • Installed {details.year}
                        </p>
                    </div>
                    <span
                        class={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest ${colors.badge} ${colors.text}`}
                    >
                        {details.status}
                    </span>
                </header>

                <div
                    class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                    <!-- Gauge Section -->
                    <div
                        class="flex flex-col items-center bg-white/50 rounded-2xl p-8 backdrop-blur-sm border border-white/50 shadow-inner"
                    >
                        <div
                            class="relative h-48 w-full flex items-center justify-center overflow-hidden"
                        >
                            <svg class="h-56 w-72" viewBox="0 0 100 65">
                                <defs>
                                    <linearGradient
                                        id="detailGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="0%"
                                    >
                                        <stop
                                            offset="0%"
                                            stop-color="#6366f1"
                                        />
                                        <stop
                                            offset="50%"
                                            stop-color="#f59e0b"
                                        />
                                        <stop
                                            offset="100%"
                                            stop-color="#f43f5e"
                                        />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M 15,55 A 35,35 0 0,1 85,55"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    stroke-width="8"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M 15,55 A 35,35 0 0,1 85,55"
                                    fill="none"
                                    stroke="url(#detailGradient)"
                                    stroke-width="8"
                                    stroke-linecap="round"
                                    stroke-dasharray="110"
                                    stroke-dashoffset={110 -
                                        (110 *
                                            Math.min(details.speed ?? 0, 200)) /
                                            200}
                                    class="transition-all duration-1000 ease-out"
                                />
                                <circle cx="50" cy="55" r="4" fill="#1e293b" />
                            </svg>
                            <div
                                class="absolute bottom-[24px] w-[3px] h-24 bg-slate-800 origin-bottom rounded-full transition-transform duration-1000 ease-out z-10"
                                style="transform: rotate({((details.speed ??
                                    0) /
                                    200) *
                                    180 -
                                    90}deg);"
                            >
                                <div
                                    class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-500 rounded-full"
                                ></div>
                            </div>
                        </div>
                        <div class="text-center -mt-4">
                            <span
                                class="text-6xl font-black text-slate-900 tracking-tighter"
                                >{details.speed ?? 0}</span
                            >
                            <span
                                class="text-lg font-bold text-slate-400 block -mt-2"
                                >RPM</span
                            >
                        </div>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            class="bg-white/80 p-6 rounded-2xl shadow-sm border border-white"
                        >
                            <p
                                class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
                            >
                                Operator
                            </p>
                            <p class="text-xl font-bold text-slate-800">
                                {details.operator}
                            </p>
                        </div>
                        <div
                            class="bg-white/80 p-6 rounded-2xl shadow-sm border border-white"
                        >
                            <p
                                class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
                            >
                                Last Maintenance
                            </p>
                            <p class="text-xl font-bold text-slate-800">
                                {details.lastMaintenance}
                            </p>
                        </div>
                        <div
                            class={`p-6 rounded-2xl shadow-sm border border-white ${colors.badge} bg-opacity-30`}
                        >
                            <p
                                class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1"
                            >
                                Current Health
                            </p>
                            <p class="text-xl font-bold text-slate-800">
                                {details.status === "ACTIVE"
                                    ? "Optimal"
                                    : details.status === "IDLE"
                                      ? "Nominal"
                                      : details.status === "BREAKDOWN"
                                        ? "Critical Error"
                                        : "Offline"}
                            </p>
                        </div>
                        <div
                            class="bg-white/80 p-6 rounded-2xl shadow-sm border border-white"
                        >
                            <p
                                class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
                            >
                                Install Year
                            </p>
                            <p class="text-xl font-bold text-slate-800">
                                {details.year}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- History Table -->
            <div
                class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
            >
                <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 class="font-semibold text-gray-800">
                        Operational History (Last 7 Days)
                    </h2>
                </div>
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                            <th class="px-6 py-3">Date</th>
                            <th class="px-6 py-3">Uptime (hrs)</th>
                            <th class="px-6 py-3">Incidents</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        {#each details.history as entry}
                            <tr>
                                <td class="px-6 py-4 text-sm text-gray-600"
                                    >{entry.date}</td
                                >
                                <td class="px-6 py-4 text-sm text-gray-900"
                                    >{entry.uptime}h</td
                                >
                                <td class="px-6 py-4 text-sm text-gray-900">
                                    <span
                                        class={entry.incidents > 0
                                            ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded"
                                            : "text-green-600"}
                                    >
                                        {entry.incidents}
                                    </span>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </main>
</div>
