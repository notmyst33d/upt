<script lang="ts">
    import Header from "$lib/components/Header.svelte";

    let { form } = $props();
</script>

<Header />

<form method="POST">
    <input
        type="text"
        name="track-number"
        placeholder="Tracking number"
        value={form?.trackNumber ?? ""}
    />
    <input type="submit" />

    {#if form?.events !== null}
        <table>
            <thead>
                <tr>
                    <td>Source</td>
                    <td>Date</td>
                    <td>Location</td>
                    <td>Description</td>
                </tr>
            </thead>
            <tbody>
                {#each form?.events as event}
                    <tr>
                        <td>{event.source}</td>
                        <td>{event.date.toLocaleString()}</td>
                        <td>{event.location}</td>
                        <td>{event.description}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</form>

<style>
    table {
        font-family: arial, sans-serif;
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
</style>
