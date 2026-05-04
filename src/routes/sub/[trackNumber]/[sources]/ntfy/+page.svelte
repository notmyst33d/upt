<script lang="ts">
    import { page } from "$app/state";
    import { i18n } from "$lib/i18n";
</script>

<form method="POST">
    <label for="domain">{i18n("sub_ntfy_domain")}</label>
    <input
        type="text"
        name="domain"
        value={page.form?.domain ?? ""}
        placeholder={i18n("sub_ntfy_domain")}
        required
    />

    <label for="topic">{i18n("sub_ntfy_topic")}</label>
    <input
        type="text"
        name="topic"
        value={page.form?.topic ?? ""}
        placeholder={i18n("sub_ntfy_topic")}
        required
    />

    <label for="token">{i18n("sub_ntfy_token")}</label>
    <input
        type="password"
        name="token"
        value={page.form?.token ?? ""}
        placeholder={i18n("sub_ntfy_token")}
        required
    />

    <input type="submit" value={i18n("sub_subscribe")} />
</form>
