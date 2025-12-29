<script lang="ts">
    import { page } from "$app/state";

    let { title, lastRefreshed, loading, onRefresh } = $props<{
        title?: string;
        lastRefreshed?: string | null;
        loading?: boolean;
        onRefresh?: () => void;
    }>();

    const isDetail = $derived(page.url.pathname.startsWith("/machines/"));
</script>

<nav
    class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200"
>
    <div class=" mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
            <!-- Logo & Brand -->
            <div class="flex items-center gap-4">
                <a
                    href="/"
                    class="flex items-center gap-2 group transition-all"
                >
                    <span
                        class="text-xl font-black text-slate-900 tracking-tighter"
                        >Svelte <span href="/" class="text-orange-500 uppercase"
                            >Dashboard</span
                        ></span
                    >
                </a>

                <div
                    class="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100"
                >
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                        ></span>
                        <span
                            class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                        ></span>
                    </span>
                    <span
                        class="text-[10px] font-bold uppercase tracking-widest text-emerald-600"
                        >Live</span
                    >
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-6">
                {#if lastRefreshed !== undefined}
                    <div class="hidden sm:flex flex-col items-end">
                        <span
                            class="text-[10px] font-black text-black uppercase tracking-tighter"
                            >Last Refreshed</span
                        >
                        <span class="text-xs font-bold text-orange-500"
                            >{lastRefreshed || "---"}</span
                        >
                    </div>
                {/if}

                {#if onRefresh}
                    <button
                        onclick={onRefresh}
                        disabled={loading}
                        class="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full border border-black text-sm font-bold active:scale-95 transition-all disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="black"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span class="hidden sm:inline uppercase">Refresh</span>
                    </button>
                {/if}
            </div>
        </div>
    </div>
</nav>
