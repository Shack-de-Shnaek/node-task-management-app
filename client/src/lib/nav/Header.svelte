<script lang="ts">
	import { navigateTo } from "svelte-router-spa";
    import { headerData } from "../../store";
	import calculateTextColor from "../utilities/calculateTextColor";
</script>

<header class="px-2 py-1 d-flex flex-wrap justify-content-between flex-column flex-sm-row gap-1 bg-light">
    <h2 class="m-0 me-sm-4 me-0">{$headerData.title}</h2>
    <ul class="header-widget-list list-unstyled m-0 ms-sm-auto ms-0 d-flex align-items-center justify-content-center justify-content-sm-end gap-1">
        {#each $headerData.widgets as widget}
            <li class="widget px-2 py-1" style="background-color: {widget.color}">
                <button class="p-0" type="button" style="color: {calculateTextColor(widget.color)}"
                on:click={() => {if(widget.href) navigateTo(widget.href)}}>
                    <span>{widget.label}</span>
                    {#if widget.value !== undefined}
                        <span>: {widget.value}</span>
                    {/if}
                </button> 
            </li>
        {/each}
    </ul>
</header>

<style>
    header {
        width: calc(100% - 4rem);
        margin-left: 4rem;
        box-shadow: var(--container-shadow);
        z-index: 1000;
    }

    header > * {
        width: max-content;
    }

    h2 {
        flex-grow: 1;
    }

    ul {
        flex-grow: 1;
    }

    .widget {
        border-radius: 0.9rem;
        width: fit-content;
    }

    button {
        background: inherit;
        outline: none;
        border: none;
    }

    @media only screen and (max-width: 577px) {
        header {
            width: 100%;
            margin-left: 0rem;
        }

        h2 {
            text-align: center;
        }

        header > * {
            width: 100%;
        }
    }
</style>
