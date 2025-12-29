<script lang="ts">
    import type { Machine } from "$lib/types";

    export let machine: Machine;

    function statusStyle(status?: string) {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700";
            case "IDLE":
                return "bg-amber-100 text-amber-700";
            case "BREAKDOWN":
                return "bg-rose-100 text-rose-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    }
</script>

<a
    href="/machines/{machine.id}"
    class="block rounded-xl bg-white p-5 shadow-xl flex flex-col justify-between h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
>
    <!-- Header -->
    <div class="flex items-center justify-between">
        <h2
            class="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors"
        >
            {machine.id ?? "Unknown Machine"}
        </h2>

        <span
            class={`rounded-full px-2 py-0.5 text-xs font-medium
      ${statusStyle(machine.status)}`}
        >
            {machine.status ?? "UNKNOWN"}
        </span>
    </div>

    <!-- Speed -->
    <div class="mt-4">
        <p class="text-sm text-gray-500">Speed</p>
        <p class="text-2xl font-bold text-gray-800">
            {machine.speed ?? 0} RPM
        </p>
    </div>

    <!-- Last Updated -->
    <div class="mt-4 flex items-center justify-between">
        <p class="text-xs text-gray-400">
            Updated: {machine.updated ?? "N/A"}
        </p>
        <div
            class="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            Details →
        </div>
    </div>
</a>
