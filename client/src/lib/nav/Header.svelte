<script lang="ts">
    import { headerData } from "../../store";
	import calculateTextColor from "../utilities/calculateTextColor";

</script>

<header class="px-2 py-1 py-sm-2 d-flex justify-content-between bg-light">
    <h1 class="m-0">{$headerData.title}</h1>
    <ul class="header-widget-list list-unstyled m-0 ms-auto d-flex align-items-center justify-content-end gap-1">
        {#each $headerData.widgets as widget}
            <li class="widget px-2 py-1" style="background-color: {widget.color}">
                <a href={widget.href} style="color: {calculateTextColor(widget.color)}">
                    <span>{widget.label}</span>
                    {#if widget.value !== undefined}
                        <span>: {widget.value}</span>
                    {/if}
                </a> 
            </li>
        {/each}
    </ul>
</header>

<style>
    header {
        width: calc(100% - 4rem);
        margin-left: 4rem;
        box-shadow: 0px 5px 6px -1px var(--light-gray);
    }

    header .widget {
        border-radius: 0.9rem;
        width: fit-content;
    }

    @media only screen and (max-width: 576px) {
        header {
            width: 100%;
            margin-left: 0rem;
        }
    }
</style>