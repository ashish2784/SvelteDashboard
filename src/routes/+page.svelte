<script lang="ts">
    import MachineCard from "$lib/components/machinecard.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import Sidebar from "$lib/components/sidebar.svelte";

    import { onMount } from "svelte";
    import { ApiService } from "$lib/services/api";
    import type { Machine } from "$lib/types";

    let machines = $state<Machine[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let lastRefreshed = $state<string | null>(null);

    // Filtering & Sorting State
    let statusFilter = $state("ALL");
    let sortBy = $state<"id" | "speed">("id");

    // Derived collection for the UI
    let displayMachines = $derived.by(() => {
        let list = [...machines];

        // 1. Filter
        if (statusFilter !== "ALL") {
            list = list.filter((m) => m.status === statusFilter);
        }

        // 2. Sort
        list.sort((a, b) => {
            if (sortBy === "speed") {
                return b.speed - a.speed; // Fast to slow
            }
            return a.id.localeCompare(b.id); // Alphabetical ID
        });

        return list;
    });

    async function loadMachines(isRefresh = false) {
        if (!isRefresh) loading = true;
        error = null;

        try {
            machines = await ApiService.getMachines();
            lastRefreshed = new Date().toLocaleTimeString();
        } catch (err: any) {
            if (machines.length === 0) {
                error = err.message || "Unable to load machine data";
            }
            console.error(err);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        // Initial load
        loadMachines();

        // Setup polling every 10 seconds
        const interval = setInterval(() => {
            loadMachines(true);
        }, 10000);

        return () => clearInterval(interval);
    });
</script>

<div class="flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <!-- Header -->
        <div
            class="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
            <div>
                <h1 class="text-2xl font-semibold">Machine Dashboard</h1>
                <p class="text-sm text-gray-500">
                    Live overview of factory machines
                </p>
            </div>
            {#if lastRefreshed}
                <div class="text-xs text-gray-400 font-medium">
                    Last Refreshed: {lastRefreshed}
                </div>
            {/if}
        </div>

        <!-- Filters & Sorting -->
        <div class="mt-8 mb-6 flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
                <label
                    for="status-filter"
                    class="text-sm font-medium text-gray-600">Status:</label
                >
                <select
                    id="status-filter"
                    bind:value={statusFilter}
                    class="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="IDLE">Idle</option>
                    <option value="BREAKDOWN">Breakdown</option>
                    <option value="OFFLINE">Offline</option>
                </select>
            </div>

            <div class="flex items-center gap-2">
                <label for="sort-by" class="text-sm font-medium text-gray-600"
                    >Sort By:</label
                >
                <select
                    id="sort-by"
                    bind:value={sortBy}
                    class="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="id">Machine ID</option>
                    <option value="speed">Highest Speed</option>
                </select>
            </div>

            <div class="ml-auto text-xs text-gray-400">
                Showing {displayMachines.length} machines
            </div>
        </div>

        <!-- ================= STATES ================= -->

        {#if loading}
            <!-- Skeleton Grid -->
            <div
                class="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]"
            >
                {#each Array(4) as _}
                    <div class="rounded-xl bg-white p-5 shadow-xl space-y-4">
                        <Skeleton class="h-4 w-1/3" />
                        <Skeleton class="h-6 w-1/2" />
                        <Skeleton class="h-10 w-full" />
                        <Skeleton class="h-3 w-1/4" />
                    </div>
                {/each}
            </div>
        {:else if error}
            <!-- Error State -->
            <div
                class="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
            >
                <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-red-900 mb-1">
                    Connection Error
                </h3>
                <p class="text-red-700 mb-6">{error}</p>
                <button
                    onclick={() => loadMachines()}
                    class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Try Again
                </button>
            </div>
        {:else if machines.length === 0}
            <!-- Initial Empty State (No machines at all) -->
            <div
                class="rounded-xl border-2 border-dashed border-slate-200 p-16 text-center"
            >
                <div
                    class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">
                    No Machines Found
                </h3>
                <p class="text-slate-500 max-w-sm mx-auto">
                    It looks like there are no factory machines registered in
                    the system yet.
                </p>
            </div>
        {:else if displayMachines.length === 0}
            <!-- Filtered Empty State -->
            <div
                class="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-500"
            >
                <p class="mb-2">
                    No machines found matching "{statusFilter}" status.
                </p>
                <button
                    onclick={() => (statusFilter = "ALL")}
                    class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    Clear Filter
                </button>
            </div>
        {:else}
            <!-- Data Loaded -->
            <div
                class="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]"
            >
                {#each displayMachines as machine (machine.id)}
                    <MachineCard {machine} />
                {/each}
            </div>
        {/if}
    </main>
</div>
