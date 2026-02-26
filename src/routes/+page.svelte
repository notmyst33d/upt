<script lang="ts">
    import { page } from "$app/state";
    import { i18n } from "$lib/i18n.js";

    let { form } = $props();
</script>

<form method="POST">
    <input
        type="text"
        name="track-number"
        placeholder={i18n("tracking_number")}
        value={form?.trackNumber ?? ""}
    />
    <input type="submit" value={i18n("track")} />

    {#if form?.events !== null}
        <table>
            <thead>
                <tr>
                    <td>{i18n("source")}</td>
                    <td>{i18n("date")}</td>
                    <td>{i18n("location")}</td>
                    <td>{i18n("description")}</td>
                </tr>
            </thead>
            <tbody>
                {#each form?.events as event}
                    <tr>
                        <td class="source">{event.source}</td>
                        <td class="date"
                            >{event.date.toLocaleString(page.data.lang)}</td
                        >
                        <td class="location">{event.location}</td>
                        <td class="description">{event.description}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</form>

<style>
    table {
        margin-top: 8px;
        border-collapse: collapse;
        width: 100%;
    }

    td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    thead tr td {
        background-color: #bdcee2;
        font-weight: 700;
    }

    tr {
        background-color: #eeeeee;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }

    @media screen and (max-width: 600px) {
        thead {
            display: none;
        }

        tr,
        td {
            display: block;
        }

        td {
            border: none;
            padding: 0px;
        }

        tr {
            border: 1px solid #dddddd;
            padding: 8px;
        }

        tr .source {
            font-weight: 700;
        }

        tr .location {
            color: #969696;
        }

        tr .date {
            color: #969696;
            position: relative;
            top: -16px;
            text-align: right;
        }
    }
</style>
