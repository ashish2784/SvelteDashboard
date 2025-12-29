<script lang="ts">
    import type { Machine } from "$lib/types";

    let { machine } = $props<{ machine: Machine }>();

    const maxSpeed = 200;

    // Graceful Handling of missing values
    let displayId = $derived(machine?.id ?? "Unknown ID");
    let displayStatus = $derived(machine?.status ?? "UNKNOWN");
    let displaySpeed = $derived(machine?.speed ?? 0);
    let displayUpdated = $derived(machine?.updated ?? "Never");
    let displayColor = $derived(machine?.color ?? "gray");

    // Tailwind color mappings to avoid dynamic class purge issues
    const colorMap: Record<
        string,
        { bg: string; badge: string; text: string; stroke: string; bar: string }
    > = {
        green: {
            bg: "bg-green-50",
            badge: "bg-green-200",
            text: "text-green-700",
            stroke: "stroke-green-500",
            bar: "bg-green-500",
        },
        yellow: {
            bg: "bg-yellow-50",
            badge: "bg-yellow-200",
            text: "text-yellow-700",
            stroke: "stroke-yellow-500",
            bar: "bg-yellow-500",
        },
        red: {
            bg: "bg-red-50",
            badge: "bg-red-200",
            text: "text-red-700",
            stroke: "stroke-red-500",
            bar: "bg-red-500",
        },
        grey: {
            bg: "bg-gray-50",
            badge: "bg-gray-200",
            text: "text-gray-700",
            stroke: "stroke-gray-500",
            bar: "bg-gray-500",
        },
        gray: {
            bg: "bg-gray-50",
            badge: "bg-gray-200",
            text: "text-gray-700",
            stroke: "stroke-gray-500",
            bar: "bg-gray-500",
        },
    };

    let colors = $derived(colorMap[displayColor] ?? colorMap["gray"]);

    function getRotation(speed: number) {
        return (speed / maxSpeed) * 180 - 90;
    }
</script>

<a
    href={`/machines/${displayId}`}
    class={`block rounded-2xl p-5 shadow-xl h-full flex flex-col justify-between ${colors.bg} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer ring-offset-2 focus:ring-2`}
>
    <!-- Header -->
    <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-800">{displayId}</h3>
        <span
            class={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge} ${colors.text}`}
        >
            {displayStatus}
        </span>
    </div>

    <!-- Status bar -->
    <div class={`mt-2 h-1 w-full rounded-full ${colors.bar}`}></div>

    <!-- Speedometer -->
    <div class="mt-4 flex flex-col gap-2">
        <p class="text-sm text-gray-500">Speed</p>

        <div class="relative w-full max-w-[180px] aspect-[2/1] mx-auto">
            <svg viewBox="0 0 200 100" class="w-full h-full">
                <path
                    d="M10 100 A90 90 0 0 1 190 100"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="10"
                />
                <path
                    d="M10 100 A90 90 0 0 1 190 100"
                    fill="none"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="283"
                    stroke-dashoffset={283 - (displaySpeed / maxSpeed) * 283}
                    class={`${colors.stroke} transition-all duration-700`}
                />
            </svg>

            <!-- Needle -->
            <div
                class="absolute bottom-0 left-1/2 h-[70%] w-[2px] bg-gray-800 origin-bottom transition-transform duration-700"
                style="transform: rotate({getRotation(displaySpeed)}deg);"
            ></div>
        </div>

        <p class="text-xl font-bold text-gray-800 text-center">
            {displaySpeed} RPM
        </p>
    </div>

    <!-- Timestamp -->
    <p class="mt-3 text-xs text-gray-400">
        Last updated: {displayUpdated}
    </p>
</a>
