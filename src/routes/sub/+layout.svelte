<script lang="ts">
    import { page } from "$app/state";
    import { i18n } from "$lib/i18n";
    import Notification from "$lib/components/Notification.svelte";
    import {
        errorColor,
        successColor,
        warningColor,
    } from "$lib/components/NotificationColors";

    const { children } = $props();
</script>

<h1>
    {i18n("sub_subscription_using").replace("{service}", page.data.service)}
</h1>

<div style:margin-bottom="8px">
    <Notification color={warningColor}>
        <p>{i18n("sub_setup_notice")}</p>
        <ol>
            <li>{i18n("sub_setup_notice1")}</li>
            <li>{i18n("sub_setup_notice2")}</li>
        </ol>
    </Notification>
</div>

{#if page.data.notice !== undefined}
    <div style:margin-bottom="8px">
        <Notification color={warningColor}>
            <p>{i18n(page.data.notice)}</p>
        </Notification>
    </div>
{/if}

{#if typeof page.form?.fail === "string"}
    <div style:margin-bottom="8px">
        <Notification color={errorColor}>
            <p>
                {i18n(page.form?.fail)
                    .replace("{status}", page.form?.status ?? "unknown")
                    .replace("{code}", page.form?.code ?? "unknown")}
            </p>
        </Notification>
    </div>
{:else if page.form?.success === true}
    <div style:margin-bottom="8px">
        <Notification color={successColor}>
            <p>{i18n("sub_setup_success")}</p>
        </Notification>
    </div>
{/if}

<label for="track_number">{i18n("track_number")}</label>
<input
    type="text"
    name="track_number"
    value={page.params.trackNumber}
    disabled
/>

<label for="sources">{i18n("sources")}</label>
<input type="text" name="sources" value={page.params.sources} disabled />

{@render children()}

<style>
    :global(input) {
        width: 100%;
        display: block;
        margin-bottom: 16px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }

    :global(label) {
        display: block;
        margin-left: 8px;
        margin-bottom: 8px;
        font-weight: 600;
    }

    input[name="track_number"] {
        font-family: "Default Mono", monospace;
    }
</style>
