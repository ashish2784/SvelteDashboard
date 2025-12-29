<script lang="ts">
    import MachineCard from "$lib/components/machinecard.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import Nav from "$lib/components/navbar.svelte";
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

        if (statusFilter !== "ALL") {
            list = list.filter((m) => m.status === statusFilter);
        }

        list.sort((a, b) => {
            if (sortBy === "speed") {
                return b.speed - a.speed;
            }
            return a.id.localeCompare(b.id);
        });

        return list;
    });

    async function loadMachines() {
        loading = true;
        error = null;

        try {
            machines = await ApiService.getMachines();
            lastRefreshed = new Date().toLocaleTimeString();
        } catch (err: any) {
            error = err.message || "Unable to load machine data";
            console.error(err);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        loadMachines();

        const interval = setInterval(() => {
            loadMachines();
        }, 10000);

        return () => clearInterval(interval);
    });
</script>

<div class="flex flex-col h-screen overflow-hidden bg-slate-50">
    <Nav
        title="Fleet Dashboard"
        {lastRefreshed}
        {loading}
        onRefresh={loadMachines}
    />

    <main class="flex-1 p-6 md:p-12 overflow-y-auto">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-2">
                    <span
                        class="text-xs font-bold text-black hover:text-orange-500 uppercase tracking-wider"
                        >Status</span
                    >
                    <select
                        bind:value={statusFilter}
                        disabled={loading}
                        class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <option value="ALL">All Units</option>
                        <option value="ACTIVE">Active</option>
                        <option value="IDLE">Idle</option>
                        <option value="BREAKDOWN">Breakdown</option>
                        <option value="OFFLINE">Offline</option>
                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <span
                        class="text-xs font-bold text-black hover:text-orange-500 uppercase tracking-wider"
                        >Sort</span
                    >
                    <select
                        bind:value={sortBy}
                        disabled={loading}
                        class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <option value="id">ID</option>
                        <option value="speed">Speed</option>
                    </select>
                </div>
            </div>

            <div
                class="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200"
            >
                <span
                    class="text-[10px] font-black text-black uppercase tracking-tighter"
                    >Machine Count:</span
                >
                <span class="text-xs font-black text-black ml-1"
                    >{displayMachines.length}</span
                >
            </div>
        </div>

        <!-- ================= STATES ================= -->

        {#if loading && machines.length === 0}
            <!-- Skeleton Grid -->
            <div
                class="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
            >
                {#each Array(4) as _}
                    <div class="rounded-xl bg-white p-6 shadow-xl space-y-6">
                        <div class="flex justify-between">
                            <Skeleton class="h-6 w-1/3" />
                            <Skeleton class="h-6 w-1/4 rounded-full" />
                        </div>
                        <div class="flex flex-col items-center gap-4">
                            <Skeleton class="h-32 w-32 rounded-full" />
                            <Skeleton class="h-12 w-1/2" />
                            <Skeleton class="h-4 w-1/3" />
                        </div>
                        <Skeleton class="h-4 w-1/4" />
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
                class="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
            >
                {#each displayMachines as machine (machine.id)}
                    <MachineCard {machine} />
                {/each}
            </div>
        {/if}
    </main>
</div>
