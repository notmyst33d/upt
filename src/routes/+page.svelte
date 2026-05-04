<script lang="ts">
    import { page } from "$app/state";
    import { i18n } from "$lib/i18n";
</script>

<form method="POST">
    <input
        type="text"
        name="track_number"
        placeholder={i18n("tracking_number")}
        value={page.data?.trackNumber ?? ""}
        required
    />
    <input
        type="hidden"
        name="sources"
        value={page.data?.sources?.join(",") ?? "all"}
    />
    <input type="submit" value={i18n("track")} />
</form>

{#if page.data?.events !== null}
    <div class="data">
        {#each page.data?.events as event}
            <div class="row">
                <span class="description">{event.description}</span>
                <span class="source">{event.source}</span>
                <div class="location">{event.location}</div>
                <span class="date"
                    >{event.date.toLocaleString(page.data.lang)}</span
                >
            </div>
        {/each}
    </div>
{/if}

{#if page.data?.sources !== undefined && page.data?.trackNumber !== undefined}
    <p>{i18n("sources")}: {page.data?.sources.join(",")}</p>
    <!-- TODO -->
    <!-- <hr />
    <h2>{i18n("sub_subscription")}</h2>
    <a
        class="ntfy-button"
        href="/sub/{page.form.trackNumber}/{page.form.sources.join(',')}/ntfy"
        >ntfy</a
    > -->
{/if}

<style>
    form {
        margin-bottom: 8px;
    }

    .source,
    .location {
        color: #929292;
    }

    .location,
    input[name="track_number"] {
        font-family: "Default Mono";
    }

    .source,
    .location {
        font-size: 12px;
    }

    .description,
    .location {
        font-weight: 600;
    }

    .row {
        max-width: 600px;
        padding: 12px 16px 12px 16px;
        border: 1px solid #a5a5ac;
        border-top: none;
    }

    .row:first-child {
        border-top: 1px solid #a5a5ac;
        border-radius: 12px 12px 0px 0px;
    }

    .row:last-child {
        border-radius: 0px 0px 12px 12px;
    }

    .ntfy-button {
        display: block;
        color: #000000;
        background-color: rgb(170, 240, 138);
        width: fit-content;
        line-height: 42px;
        border: none;
        cursor: pointer;
        padding: 0px 12px 0px 12px;
        border-radius: 24px;
        font-weight: 600;
        text-decoration: none;
    }
</style>
