<script lang="ts">
	import { navigateTo } from "svelte-router-spa";

    export let label: string;
    export let value: string | number = undefined;
    export let href: string = undefined;
    export let componentClass: string = undefined;

    const click = () => {
        if(href) navigateTo(href);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="widget btn w-100 {componentClass}" on:click={click}>
    <div class="widget-content">
        <span>{label}</span>
        {#if value !== undefined}
            <span>: {value}</span>
        {/if}
    </div>
</div>

<style>    
    .widget {
        border-radius: 1rem;
        font-size: clamp(1rem, 1.5vw, 1.25rem);
    }

    .widget-content {
        margin: 0;
        display: flex;
        justify-content: center;
        user-select: none;
    }
</style>