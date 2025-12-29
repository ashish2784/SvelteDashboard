<script lang="ts">
    import { page } from "$app/stores";
    import rsLogo from "$lib/assets/rs-logo.jpeg";

    interface Item {
        name: string;
        href: string;
        icon: string;
    }

    const items: Item[] = [
        {
            name: "Dashboard",
            href: "/",
            icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        },
    ];

    let collapsed = $state(false);
    let mobileOpen = $state(false);

    function toggleSidebar() {
        collapsed = !collapsed;
    }

    function toggleMobile() {
        mobileOpen = !mobileOpen;
    }

    function isActive(path: string, href: string) {
        if (href === "/" && path === "/") return true;
        if (href !== "/" && path.startsWith(href)) return true;
        return false;
    }
</script>

<!-- Mobile Toggle Button (Fixed on screen) -->
<button
    class="md:hidden fixed z-[110] bottom-4 right-4 p-3 bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform"
    onclick={toggleMobile}
    aria-label="Toggle Menu"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        {#if mobileOpen}
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
        {:else}
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
            />
        {/if}
    </svg>
</button>

<!-- Mobile Backdrop -->
{#if mobileOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm"
        onclick={toggleMobile}
    ></div>
{/if}

<!-- Sidebar Container -->
<aside
    class={`fixed inset-y-0 left-0 z-[100] flex flex-col bg-black text-white shadow-2xl transition-all duration-300 md:relative md:h-screen border-r border-slate-800 shrink-0 w-64
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "md:w-20" : "md:w-64"}
    `}
>
    <div class="h-16 flex items-center px-6 border-b border-slate-800">
        <div
            class="flex items-center gap-3 overflow-hidden justify-center w-full"
        >
            {#if collapsed}
                <img src={rsLogo} alt="R Logo" class="h-8 w-8 object-cover" />
            {:else}
                <img
                    src="/images/logo.png"
                    alt="RobotSpace"
                    class="h-12 w-auto object-contain"
                />
            {/if}
        </div>
    </div>

    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        {#each items as item}
            {@const active = isActive($page.url.pathname, item.href)}
            <a
                href={item.href}
                class={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${
                        active
                            ? "bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                `}
                onclick={() => (mobileOpen = false)}
                title={collapsed ? item.name : ""}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class={`h-6 w-6 shrink-0 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d={item.icon}
                    />
                </svg>
                <span
                    class={`font-medium whitespace-nowrap transition-all duration-200 ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}
                >
                    {item.name}
                </span>
            </a>
        {/each}
    </nav>

    <div class="p-4 border-t border-slate-800">
        <button
            onclick={toggleSidebar}
            class="hidden md:flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class={`h-5 w-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
            </svg>
        </button>
    </div>

</aside>
