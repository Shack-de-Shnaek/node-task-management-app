<script lang="ts">
	import type { Writable } from "stream";
	import { Navigate } from "svelte-router-spa";
	import calculateTextColor from "../utilities/calculateTextColor";

    export let label: string;
    export let value: string | number = undefined;
    export let href: string = undefined;
    export let componentClass: string = undefined;

</script>

<div class="widget btn w-100 {componentClass}">
    {#if href}
        <Navigate to={href}>
            <div class="widget-content">
                <span>{label}</span>
                {#if value !== undefined}
                    <span>: {value}</span>
                {/if}
            </div>
        </Navigate>
    {:else}
        <div class="widget-content">
            <span>{label}</span>
            {#if value !== undefined}
                <span>: {value}</span>
            {/if}
        </div>
    {/if}
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