<script lang="ts">
    import Logo from "$lib/svg/Logo.svelte";
    import Settings from "$lib/svg/Settings.svelte";

    const { children } = $props();
</script>

<a href="/" title="UnifiedParcelTracking logo"><Logo /></a>
<a href="/settings" title="Settings"><Settings /></a>

<div>
    {@render children()}
</div>

<style>
    @font-face {
        font-family: "Default Sans";
        src: url($lib/assets/default_sans.ttf);
    }

    @font-face {
        font-family: "Default Mono";
        src: url($lib/assets/default_mono.ttf);
    }

    :global(*) {
        font-family: "Default Sans", system-ui, sans-serif, "Arial", "Helvetica",
            serif;
    }

    :global(body) {
        width: 100%;
        max-width: 600px;
        margin: auto;
        padding: 16px;
        box-sizing: border-box;
        font-size: 14px;
    }

    :global(input, select) {
        font-size: 14px;
    }

    :global(input[type="submit"]) {
        color: #ffffff;
        background-color: #1976d2;
        height: 40px;
        border: none;
        cursor: pointer;
        padding: 0px 16px 0px 16px;
        border-radius: 32px;
        font-weight: 600;
        transition-property: background-color;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(input[type="submit"]:hover) {
        background-color: #125497;
    }

    :global(input[type="text"], input[type="password"], select) {
        background-color: transparent;
        height: 40px;
        padding: 0px 16px 0px 16px;
        outline: none;
        border: none;
        box-shadow: inset 0 0 0 1px #a5a5ac;
        vertical-align: middle;
        border-radius: 32px;
        transition-property: box-shadow;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(
            input[type="text"]:hover,
            input[type="password"]:hover,
            select:hover
        ) {
        box-shadow: inset 0 0 0 1px #6b6b70;
    }

    :global(
            input[type="text"]:focus,
            input[type="password"]:focus,
            select:focus
        ) {
        box-shadow: inset 0 0 0 2px #1976d2;
    }

    :global(input[type="text"]:disabled, input[type="password"]:disabled) {
        color: #a5a5ac;
        box-shadow: inset 0 0 0 1px #d5d5d8;
    }

    :global(h1) {
        font-size: 24px;
        font-weight: 600;
        padding: 0px;
        margin: 16px 0px 16px 0px;
    }

    :global(h2) {
        font-size: 20px;
        font-weight: 600;
        padding: 0px;
        margin: 12px 0px 12px 0px;
    }

    :global(hr) {
        height: 1px;
        background-color: #a5a5ac;
        border: none;
    }

    /* TODO */
    /* @media (prefers-color-scheme: dark) {
        :global(body) {
            color: #ffffff;
            background-color: #000000;
        }

        :global(
                svg g path[aria-label="UnifiedParcelTracking"],
                svg path[aria-label="Settings"]
            ) {
            fill: #ffffff;
        }

        :global(input[type="text"], input[type="password"], select) {
            color: #ffffff;
            outline: 1px solid #626266;
        }
    } */

    a[title="Settings"] {
        margin-left: 16px;
    }

    div {
        margin-top: 8px;
    }
</style>
