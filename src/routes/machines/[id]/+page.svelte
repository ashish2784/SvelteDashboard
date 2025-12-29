<script lang="ts">
    import { page } from "$app/state";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { ApiService } from "$lib/services/api";

    let machineId = $derived(page.params.id);
    let details = $state<any>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    async function fetchDetails() {
        if (!machineId) return;
        loading = true;
        error = null;
        try {
            details = await ApiService.getMachineDetails(machineId as string);
        } catch (e: any) {
            error = e.message || "Could not load machine details.";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        // Re-fetch whenever machineId changes
        if (machineId) {
            fetchDetails();
        }
    });
</script>

<div class="flex min-h-screen bg-slate-50">
    <Sidebar />

    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <!-- Breadcrumbs -->
        <nav class="mb-4 text-sm text-gray-500">
            <a href="/" class="hover:text-indigo-600 transition-colors"
                >Dashboard</a
            >
            <span class="mx-2">/</span>
            <span class="font-medium text-gray-800">{machineId}</span>
        </nav>

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
            <header class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">{details.id}</h1>
                <p class="text-gray-500">
                    {details.model} • Installed {details.year}
                </p>
            </header>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
                >
                    <p class="text-sm text-gray-500 mb-1">Status</p>
                    <p class="text-xl font-semibold">Running Smoothly</p>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
                >
                    <p class="text-sm text-gray-500 mb-1">Operator</p>
                    <p class="text-xl font-semibold">{details.operator}</p>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
                >
                    <p class="text-sm text-gray-500 mb-1">Last Maintenance</p>
                    <p class="text-xl font-semibold">
                        {details.lastMaintenance}
                    </p>
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
