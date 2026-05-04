<script lang="ts">
    import { page } from "$app/state";
    import { i18n } from "$lib/i18n";
</script>

<h1>{i18n("settings")}</h1>

<form method="POST">
    <label for="lang">{i18n("language")}</label>
    <select name="lang">
        <option value="en" selected={page.data.lang === "en"}>English</option>
        <option value="ru" selected={page.data.lang === "ru"}>Русский</option>
    </select>
    <hr />
    <input type="submit" value={i18n("apply")} />
</form>

<style>
    label {
        display: block;
        margin-left: 8px;
        margin-bottom: 8px;
        font-weight: 600;
    }

    input {
        display: block;
    }

    input[type="submit"] {
        margin-top: 8px;
    }
</style>
