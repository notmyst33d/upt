<script lang="ts">
    const { children, color } = $props();
</script>

<div class="container" style:border="1px solid {color}">
    <div class="ribbon" style:color style:background-color={color}>-</div>
    <div class="content">
        {@render children()}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
    }

    .ribbon {
        flex: 1;
        width: 8px;
    }

    .content {
        margin: 0px 8px 0px 8px;
    }
</style>
